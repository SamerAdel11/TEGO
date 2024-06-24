from rest_framework import serializers
from .models import Transaction,ResponsePreviousWork,CustomUser, Company, Owner, ResponsePrivateCondition, Supplier, UserNotification, TenderAd, Tender, TenderAdmin, TenderPublicConditions, TenderPrivateConditions, TenderProduct, ResponseProductBid, TenderResponse
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from tasks.tasks import compute_similarity
from django.utils.formats import date_format
from django.utils import translation
from django.utils.formats import date_format
from django.conf import settings

class UserSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(
        style={'input_type': 'password'}, write_only=True)
    class Meta:
        model = CustomUser
        fields = ['id',
                'email', 'password', 'password2','verified']
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

class CompanySerializer(serializers.ModelSerializer):
    owners = OwnerSerializer(many=True, required=False)
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
from datetime import datetime

class TenderAdSerializer(serializers.ModelSerializer):
    deadline_arabic = serializers.SerializerMethodField()
    id = serializers.IntegerField(required=False)
    def get_deadline_arabic(self, obj):
        # Convert deadline date to Arabic format
        return self.format_date(obj.deadline)
    def format_date(self, date):
        if date:
            with translation.override('ar'):
                return date_format(date, format='j F Y')
        else: 
            return None

    class Meta:
        model = TenderAd
        fields = ['id','title', 'topic', 'deadline', 'field','deadline_arabic','finalInsurance']
        read_only_fields = ['deadline_arabic']
        extra_kwargs = {
            'title': {'allow_null': True, 'required': False},
            'topic': {'allow_null': True, 'required': False},
            'deadline': {'allow_null': True, 'required': False},
            'field': {'allow_null': True, 'required': False},
            'finalInsurance': {'allow_null': True, 'required': False},
            'condition': {'allow_null': True, 'required': False},
        }


class TenderAdminSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = TenderAdmin
        fields = ['id','name', 'job_title']
        extra_kwargs = {
            'name': {'allow_null': True},
            'job_title': {'allow_null': True},

        }

class TenderPublicConditionsSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = TenderPublicConditions
        fields = ['id','condition']
        extra_kwargs = {
        'condition': {'allow_null': True},
        }
    
class TenderPrivateConditionsSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = TenderPrivateConditions
        fields = ['id','condition']
        extra_kwargs = {
            'condition': {'allow_null': True},
        }

class TenderProductSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = TenderProduct
        fields = ['id', 'title', 'quantity_unit', 'quantity', 'description']
        extra_kwargs = {
            'title': {'required': False,'allow_null': True},
            'quantity_unit': {'allow_null': True},
            'quantity': {'allow_null': True},
            'description': {'allow_null': True},
        }


class TenderSerializer(serializers.ModelSerializer):
    admins = TenderAdminSerializer(many=True)
    public_conditions = TenderPublicConditionsSerializer(many=True)
    private_conditions = TenderPrivateConditionsSerializer(many=True)
    ad = TenderAdSerializer(many=False)
    products = TenderProductSerializer(many=True)
    id = serializers.IntegerField(required=False)
    number_of_responses= serializers.SerializerMethodField()
    def get_number_of_responses(self,object):
        return TenderResponse.objects.filter(tender_id=object.id).count()
    class Meta:
        model = Tender
        fields = ['id','initial_price', 'status', 'admins',
                'public_conditions', 'private_conditions', 'ad', 'products','number_of_responses']
        extra_kwargs = {
            'initial_price': {'required':False,'allow_null': True},
            'status': {'allow_null': True},
            'admins': {'allow_null': True},
            'public_conditions': {'allow_null': True},
            'private_conditions': {'allow_null': True},
            'ad': {'allow_null': True},
            'products': {'allow_null': True},
        }
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
        original_data['id']=tender.id
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
        return tender
    def update(self,instance,validated_data):
        # print(validated_data)
        original_data = validated_data.copy()
        user = self.context['request'].user
        admins_data = validated_data.pop('admins')
        public_conditions_data = validated_data.pop('public_conditions')
        private_conditions_data = validated_data.pop('private_conditions')
        products_data = validated_data.pop('products')
        ad_data = validated_data.pop('ad')
        print(ad_data)
        # update TenderAd
        # ad_id=ad_data.get('id')
        # print(ad_id)
        ad_instance=TenderAd.objects.get(tender=instance)
        ad_instance.title=ad_data.get('title')
        ad_instance.topic=ad_data.get('topic')
        ad_instance.deadline=ad_data.get('deadline')
        ad_instance.field=ad_data.get('field')
        ad_instance.finalInsurance=ad_data.get('finalInsurance')
        ad_instance.save()

        #Update Tender instance Attributes 
        instance.initial_price=validated_data.get('initial_price')
        instance.status=validated_data.get('status')
        instance.save()


        for product in products_data:
            print(product)
            product_id=product.pop('id',None)
            if product_id:
                product_instance=TenderProduct.objects.get(id=product_id)
                product_instance.title=product.get('title')
                product_instance.quantity_unit=product.get('quantity_unit')
                product_instance.quantity=product.get('quantity')
                product_instance.description=product.get('description')
                product_instance.save()
            else:
                print("CREATE NEW PRODUCT")
                TenderProduct.objects.create(**product,tender=instance)

        for admin in admins_data:
            admin_id=admin.pop('id',None)
            if admin_id:
                admin_instance=TenderAdmin.objects.get(id=admin_id)
                admin_instance.name=admin.get('name')
                admin_instance.job_title=admin.get('job_title')
                admin_instance.save()
            else:
                TenderAdmin.objects.create(**admin,tender=instance)

        for condition in public_conditions_data:
            public_condition_id=condition.pop('id',None)
            if public_condition_id:
                public_condition_instance=TenderPublicConditions.objects.get(id=public_condition_id)
                public_condition_instance.condition=condition.get('condition')
                public_condition_instance.save()
            else:
                TenderPublicConditions.objects.create(**condition,tender=instance)

        for condition in private_conditions_data:
            private_condition_id=condition.pop('id',None)
            if private_condition_id:
                private_condition_instance=TenderPrivateConditions.objects.get(id=private_condition_id)
                private_condition_instance.condition=condition.get('condition')
                private_condition_instance.save()
            else:
                TenderPrivateConditions.objects.create(**condition,tender=instance)
        return instance
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        # Sort nested fields by id
        ret['admins'] = sorted(ret['admins'], key=lambda x: x['id'])
        ret['public_conditions'] = sorted(ret['public_conditions'], key=lambda x: x['id'])
        ret['private_conditions'] = sorted(ret['private_conditions'], key=lambda x: x['id'])
        ret['products'] = sorted(ret['products'], key=lambda x: x['id'])
        return ret

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

class ResponsePreviousWorkSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model=ResponsePreviousWork
        fields=['title','description']



class ProductResponseSerializer(serializers.ModelSerializer):
    productid = serializers.CharField(write_only=True,required=False)
    id = serializers.IntegerField(required=False)

    # supplying_duration = serializers.CharField(allow_null=True, required=False)
    class Meta:
        model = ResponseProductBid
        fields = ['id','provided_quantity','productid','product_title','product_description',
                 'supplying_status', 'product_description','price']
        extra_kwargs = {
        "price":  {'required':False,'allow_null': True},
        "provided_quantity": {"required": False, "allow_null": True},
        "product_title": {"required": False, "allow_null": True},
        "product_description": {"required": False, "allow_null": True},
        "provided_quantity": {"required": False, "allow_null": True},
        }


class ResponsePrivateConditionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = ResponsePrivateCondition
        fields = ['id', 'condition','offered_condition']
        extra_kwargs = {"offered_condition": {"required": False, "allow_null": True},}


class ResponseSerializer(serializers.ModelSerializer):
    offer_products = ProductResponseSerializer(many=True)
    # Assuming you just want the string representation of conditions
    offer_conditions = ResponsePrivateConditionSerializer(many=True)
    tender_id = serializers.CharField()
    previous_work=ResponsePreviousWorkSerializer(many=True)
    class Meta:
        model = TenderResponse
        fields = ['id', 'offered_price', 'tender_id','previous_work',
                'status', 'offer_products', 'offer_conditions']
        extra_kwargs={'offer_products':{"required":False,"allow_null": True}}

    def create(self, validated_data):
        print("validated_data is ",validated_data)
        user = self.context['request'].user
        data = validated_data.copy()
        offer_products_data = validated_data.pop('offer_products')
        offer_conditions_data = validated_data.pop('offer_conditions')
        previous_work_data=validated_data.pop('previous_work')

        # print(validated_data)
        tender = Tender.objects.get(id=validated_data['tender_id'])
        response = TenderResponse.objects.create(
            offered_price=validated_data.get('offered_price'),
            tender=tender,
            user=user,
            status=validated_data.get('status')
            )

        tender_data=''
        response_data=''
        for product_data in offer_products_data:
            productid = product_data.pop('productid',None)
            if not productid:
                productid = product_data.pop('id',None)
            product = TenderProduct.objects.get(id=productid)
            tender_data=tender_data+product.title+"|"+product.description+"|"+product.quantity+"|"
            if product_data.get('supplying_status')!="متوفر":
                response_data=response_data+' '+"|"+' '+"|"+' '+"|"
            else:
                response_data=response_data+product_data.get('product_title')+"|"+product_data.get('product_description')+"|"+str(product_data.get('provided_quantity'))+"|"
            ResponseProductBid.objects.create(
                product=product,
                response=response,**product_data)

        offer_previous_work=[]
        for work in previous_work_data:
            offer_previous_work.append(work.get('title')+"|"+work.get('description')+"|")
            ResponsePreviousWork.objects.create(response=response,**work)
        ad=TenderAd.objects.get(tender=tender)
        tender_ad=ad.title+"|"+ad.topic+"|"
        print("offer previous work is",offer_previous_work)
        for condition_data in offer_conditions_data:
            condition_instance=condition_data.get('condition')
            tender_data= tender_data +condition_instance.condition+"|"
            response_data = response_data+ condition_data.get('offered_condition') + "|"
            new_condition=ResponsePrivateCondition.objects.create(
                condition=condition_data.get('condition'),
                response=response,
                offered_condition=condition_data.get('offered_condition'))
            print("new_condition id is ",new_condition)

        compute_similarity.delay(tender_data,response_data,response.id,offer_previous_work,tender_ad)
        return response
    def update(self, instance, validated_data):
        offer_products_data = validated_data.pop('offer_products', [])
        offer_conditions_data = validated_data.pop('offer_conditions', [])
        previous_work_data = validated_data.pop('previous_work', [])
        print("offer_products_data",offer_products_data)

        instance.offered_price = validated_data.get('offered_price', instance.offered_price)
        instance.status = validated_data.get('status', instance.status)
        instance.save()

        for product_data in offer_products_data:
            productid = product_data.get('id', None)
            print("product_id is ",productid)
            product = ResponseProductBid.objects.get(id=productid)
            product.provided_quantity=product_data.get('provided_quantity')
            product.product_title=product_data.get('product_title')
            product.product_description=product_data.get('product_description')
            product.supplying_status=product_data.get('supplying_status')
            product.price=product_data.get('price')
            product.save()
            print("Product saved")

        for condition_data in offer_conditions_data:
            condition_id=condition_data.get('id')

            condition=ResponsePrivateCondition.objects.get(id=condition_id)
            condition.offered_condition=condition_data.get('offered_condition')
            condition.save()

        for work_data in previous_work_data:
            work_id=work_data.get('id')

            work=ResponsePreviousWork.objects.get(id=work_id)
            work.title=work_data.get('title')
            work.description=work_data.get('description')
            work.save()
        return instance
class ProductResponseRetrieveSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source='product_title', read_only=True)
    quantity_unit= serializers.CharField(source='product.quantity_unit')
    product_id=serializers.CharField(source='product.id',read_only=True)
    class Meta:
        model = ResponseProductBid
        fields = ['id', 'product_id','title' ,'quantity_unit','provided_quantity',
                'supplying_status','price', 'product_description']


class ResponseDetailSerializer(serializers.ModelSerializer):
    offer_products = ProductResponseRetrieveSerializer(many=True)
    # Assuming you just want the string representation of conditions
    offer_conditions = ResponsePrivateConditionSerializer(many=True)
    previous_work=ResponsePreviousWorkSerializer(many=True)

    class Meta:
        model = TenderResponse
        fields = ['id', 'offered_price','previous_work','score',
                'status', 'offer_products', 'offer_conditions']
    def update(self, instance, validated_data):
        # Check if 'status' is present in validated_data
        if 'status' in validated_data:
            # Update only 'status' attribute
            instance.status = validated_data['status']
            instance.save(update_fields=['status'])  # Only update 'status' field
        return instance
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # If the instance is a queryset, sort it by score in descending order
        if isinstance(instance, list):
            representation = sorted(representation, key=lambda x: x['score'], reverse=True)
        return representation

class TransactionSerializer(serializers.ModelSerializer):
    review_date_arabic = serializers.SerializerMethodField()
    tender_title = serializers.SerializerMethodField()
    def get_tender_title(self,obj):
        return obj.tender.ad.title
    def get_review_date_arabic(self, obj):
        # Convert deadline date to Arabic format
        if obj.product_review_date is not None:
            return self.format_date(obj.product_review_date)
    def format_date(self, date):
        with translation.override('ar'):
            return date_format(date, format='j F Y')
    class Meta:
        model= Transaction
        fields= ['id','response','tender','product_review_date','product_review_date_status','product_review_status','review_date_arabic','tender_title']
        extra_kwargs = {
            'product_review_date': {'required': False, 'allow_null': True},
            'product_review_date_status': {'required': False, 'allow_null': True},
            'product_review_status': {'required': False, 'allow_null': True},
        }
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