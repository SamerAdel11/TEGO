from rest_framework import serializers
from .models import CustomUser, Company, Owner, CompanyField, ResponsePrivateCondition, Supplier, UserNotification, TenderAd, Tender, TenderAdmin, TenderPublicConditions, TenderPrivateConditions, TenderProduct, ResponseProductBid, TenderResponse
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
class UserSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(
        style={'input_type': 'password'}, write_only=True)
    class Meta:
        model = CustomUser
        fields = ['id','first_name', 'last_name',
                'email', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    def validate(self, data):
        password = data['password']
        password2 = data['password2']
        if password != password2:
            raise serializers.ValidationError('Passwords do\'nt match')
        else:
            return data
    def create(self, validated_data):
        validated_data.pop('password2')
        user = CustomUser.objects.create(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return validated_data
class OwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Owner
        exclude = ['company']
    def update(self, instace, validated_data):
        instace.name = validated_data.get('name', instace.name)
        instace.owner_id = validated_data.get('owner_id',
                                              instace.owner_id)
        instace.owner_position = validated_data.get('onwer_position',
                                                    instace.onwer_position)
        instace.address = validated_data.get('address',
                                             instace.address)
class CompanyFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyField
        exclude = ['id', 'company']
class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        exclude = ['company']
class NotificationnSerializer(serializers.ModelSerializer):
    # time_since = serializers.SerializerMethodField()
    class Meta:
        model = UserNotification
        fields = ['recipient', 'actor', 'event',
                  'verb', 'message', 'timestamp']

    # def get_time_since(self, obj):
    #     # Calculate the time difference between the current datetime and obj.datetime_field
    #     return timesince(obj.datetime_field)
class CompanySerializer(serializers.ModelSerializer):
    owners = OwnerSerializer(many=True, required=False)
    company_fields = CompanyFieldSerializer(many=True)
    user = UserSerializer(many=False)
    supplier = SupplierSerializer(many=False, required=False)
    class Meta:
        model = Company
        fields = "__all__"
    def validate(self, data):
        password = data['user']['password']
        password2 = data['user']['password2']
        if password != password2:
            raise serializers.ValidationError('Passwords don\'t match')
        else:
            return data
    def create(self, validated_data):
        original_data=validated_data.copy()
        # create user instance
        user = validated_data.pop('user')
        user.pop('password2')
        user = CustomUser.objects.create(**user)
        user.set_password(user.password)
        user.save()
        # extract other entities
        owners = validated_data.get('owners')
        if owners:
            validated_data.pop('owners')
        company_fields = validated_data.pop('company_fields')
        if validated_data.get('company_type_tego') == 'supplier':
            supplier = validated_data.pop('supplier')
            company = Company.objects.create(**validated_data, user=user)
            supplier = Supplier.objects.create(**supplier, company=company)
        else:
            company = Company.objects.create(**validated_data, user=user)
        # iterate over owners and create each instance
        # print(owners)
        if owners:
            for owner in owners:
                Owner.objects.create(**owner, company=company)
        # iterate over fields and create instances
        for field in company_fields:
            CompanyField.objects.create(**field, company=company)
        UserNotification.objects.create(
            recipient=user, message='you have successfully created your account')
        return user
    # def update(self, instace, validated_data):
    #     print('entered update method')
    #     instace.name = validated_data.get('name', instace.name)
    #     instace.location = validated_data.get('location', instace.name)
    #     instace.commercial_registration_number = validated_data.get(
    #         'commercial_registration_number',
    #         instace.commercial_registration_number)
    #     instace.tax_card_number = validated_data.get('tax_card_number',
    #                                                  instace.tax_card_number)
    #     instace.mobile = validated_data.get('mobile', instace.mobile)
    #     instace.landline = validated_data.get('landline', instace.landline)
    #     instace.fax_number = validated_data.get(
    #         'fax_number', instace.fax_number)
    #     instace.company_type = validated_data.get(
    #         'company_type', instace.company_type)
    #     instace.company_capital = validated_data.get(
    #         'company_capital', instace.company_capital)
    #     instace.save()
    #     owners = validated_data.get('owners')
    #     for owner in owners:
    #         owner_id = owner.get('id')
    #         if owner_id is None:
    #             print('owner id isn\'t found')
    #             Owner.objects.create(**owner)
    #         else:
    #             print(f"owner id is found and it = {owner_id}")
    #             owner_instance = Owner.objects.get(id=owner_id)
    #             serializer=OwnerSerializer(instance=owner_instance,data=owner)
    #             serializer.update(owner_instance,owner)
    #             owner_instance.save()
    #     return instace
class TenderAdSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenderAd
        fields = ['title', 'topic', 'deadline', 'field']

class TenderAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenderAdmin
        fields = ['name', 'job_title']

class TenderPublicConditionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenderPublicConditions
        fields = ['condition']
    
class TenderPrivateConditionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenderPrivateConditions
        fields = ['id','condition']

class TenderProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenderProduct
        fields = ['id', 'title', 'quantity_unit', 'quantity', 'description']


class TenderSerializer(serializers.ModelSerializer):
    admins = TenderAdminSerializer(many=True)
    public_conditions = TenderPublicConditionsSerializer(many=True)
    private_conditions = TenderPrivateConditionsSerializer(many=True)
    ad = TenderAdSerializer(many=False)
    products = TenderProductSerializer(many=True)
    class Meta:
        model = Tender
        fields = ['initial_price', 'status', 'admins',
                'public_conditions', 'private_conditions', 'ad', 'products']
    def create(self, validated_data):
        original_data = validated_data.copy()
        user = self.context['request'].user
        admins_data = validated_data.pop('admins')
        public_conditions_data = validated_data.pop('public_conditions')
        private_conditions_data = validated_data.pop('private_conditions')
        products_data = validated_data.pop('products')
        ad_data = validated_data.pop('ad')
        ad_instance = TenderAd.objects.create(**ad_data)
        tender = Tender.objects.create(
            **validated_data, user=user, ad=ad_instance)
        for admin_data in admins_data:
            TenderAdmin.objects.create(tender=tender, **admin_data)
        for public_condition_data in public_conditions_data:
            TenderPublicConditions.objects.create(
                tender=tender, **public_condition_data)
        for private_condition_data in private_conditions_data:
            TenderPrivateConditions.objects.create(
                tender=tender, **private_condition_data)
        for product_data in products_data:
            TenderProduct.objects.create(tender=tender, **product_data)
        tender.save()
        return original_data

class TenderRetrieveSerializer(serializers.ModelSerializer):
    admins = TenderAdminSerializer(many=True, read_only=True)
    public_conditions = TenderPublicConditionsSerializer(
        many=True, read_only=True)
    private_conditions = TenderPrivateConditionsSerializer(
        many=True, read_only=True)
    ad = TenderAdSerializer(read_only=True)
    products = TenderProductSerializer(many=True, read_only=True)
    class Meta:
        model = Tender
        fields = ['id', 'initial_price', 'status', 'admins',
                'public_conditions', 'private_conditions', 'ad', 'products']


class ProductResponseSerializer(serializers.ModelSerializer):
    productid = serializers.CharField(write_only=True)
    # supplying_duration = serializers.CharField(allow_null=True, required=False)
    class Meta:
        model = ResponseProductBid
        fields = ['id', 'productid', 'provided_quantity','product_title','product_description',
                  'supplying_status', 'product_description','supplying_duration']
        extra_kwargs = {"supplying_duration": {"required": False, "allow_null": True},}


class ResponsePrivateConditionSerializer(serializers.ModelSerializer):
    # offered_condition = serializers.CharField(allow_null=True, required=False)
    class Meta:
        model = ResponsePrivateCondition
        fields = ['id', 'condition','offered_condition']
        extra_kwargs = {"offered_condition": {"required": False, "allow_null": True},}


class ResponseSerializer(serializers.ModelSerializer):
    offer_products = ProductResponseSerializer(many=True)
    # Assuming you just want the string representation of conditions
    offer_conditions = ResponsePrivateConditionSerializer(many=True)
    tender_id = serializers.CharField()
    class Meta:
        model = TenderResponse
        fields = ['id', 'offered_price', 'tender_id',
                'status', 'offer_products', 'offer_conditions']

    def create(self, validated_data):
        user = self.context['request'].user
        data = validated_data.copy()
        offer_products_data = validated_data.pop('offer_products')
        offer_conditions_data = validated_data.pop('offer_conditions')
        # print(validated_data)
        tender = Tender.objects.get(id=validated_data['tender_id'])
        response = TenderResponse.objects.create(
            offered_price=validated_data.get('offered_price'),
            tender=tender,
            user=user
            )
        for product_data in offer_products_data:
            print(product_data)
            print("*"*10)
            productid = product_data.pop('productid')
            product = TenderProduct.objects.get(id=productid)
            ResponseProductBid.objects.create(
                product=product,
                response=response,**product_data)

        for condition_data in offer_conditions_data:
            # condition_instance=TenderPrivateConditions.objects.get(id=condition_data.get('condition'))
            ResponsePrivateCondition.objects.create(
                condition=condition_data.get('condition'),
                response=response,
                offered_condition=condition_data.get('offered_condition'))
        return data
class ProductResponseRetrieveSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source='product.title', read_only=True)
    quantity_unit= serializers.CharField(source='product.quantity_unit')
    product_id=serializers.CharField(source='product.id',read_only=True)
    class Meta:
        model = ResponseProductBid
        fields = ['id', 'product_id','title' ,'quantity_unit','provided_quantity',
                'supplying_status','supplying_duration', 'product_description']


class ResponseDetailSerializer(serializers.ModelSerializer):
    offer_products = ProductResponseRetrieveSerializer(many=True)
    # Assuming you just want the string representation of conditions
    offer_conditions = ResponsePrivateConditionSerializer(many=True)
    class Meta:
        model = TenderResponse
        fields = ['id', 'offered_price',
                'status', 'offer_products', 'offer_conditions']
    def update(self, instance, validated_data):
        # Check if 'status' is present in validated_data
        if 'status' in validated_data:
            # Update only 'status' attribute
            instance.status = validated_data['status']
            instance.save(update_fields=['status'])  # Only update 'status' field
        return instance

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['email'] = user.email
        token['company_type'] = Company.objects.get(
            user=user).company_type_tego
        # ...
        return token