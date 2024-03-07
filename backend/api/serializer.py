from rest_framework import serializers
from .models import CustomUser, Company, Owner,CompanyField,Branch
from rest_framework.authtoken.models import Token
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name',
                'email','password','password2']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    
    def validate(self,data):
        password = data['password']
        password2 = data['password2']
        if password != password2:
            raise serializers.ValidationError('Passwords do\'nt match')
        else: 
            return data
    def create(self, validated_data):
        validated_data.pop('password2')
        user=CustomUser.objects.create(**validated_data)
        user.set_password(validated_data['password'])                                                                                                                                                             
        user.save()
        return validated_data

class OwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Owner
        exclude = ['company']

class CompanyFieldSerializer(serializers.ModelSerializer):
        class Meta:
            model = CompanyField
            exclude = ['id','company']

class CompanySerializer(serializers.ModelSerializer):
    owners = OwnerSerializer(many=True)
    company_fields=CompanyFieldSerializer(many=True)
    user = UserSerializer(many=False)


    class Meta:
        model = Company
        fields = "__all__"


    def validate(self,data):
        password = data['user']['password']
        password2 = data['user']['password2']
        if password != password2:
            raise serializers.ValidationError('Passwords don\'t match')
        else: 
            return data

    def create(self, validated_data):
        print("enter create function")
        # create user instance
        user = validated_data.pop('user')
        user.pop('password2')
        user = CustomUser.objects.create(**user)
        user.set_password(user.password)
        user.save()
        # create token for that user
        token = Token.objects.create(user=user)
        
        #extract other entities 
        owners = validated_data.pop('owners')
        company_fields=validated_data.pop('company_fields')

        # create company instance
        company = Company.objects.create(**validated_data, user=user)

        # iterate over owners and create each instance
        print(owners)
        for owner in owners:
            Owner.objects.create(**owner, company=company)
        
        #iterate over fields and create instances
        for field in company_fields:
            CompanyField.objects.create(**field,company=company)

        # add token to the serializer
        company_data = CompanySerializer(company).data
        company_data['user']['token'] = token.key
        return company_data

    def update(self, instace, validated_data):
        owners = validated_data.pop('owners')
        company = Company.objects.create(**validated_data)
        instace.name = validated_data.get('name', instace.name)
        instace.location = validated_data.get('location', instace.name)
        instace.commercial_registration_number = validated_data.get(
            'commercial_registration_number',
            instace.commercial_registration_number)
        instace.tax_card_number = validated_data.get('tax_card_number',
                                                     instace.tax_card_number)
        instace.mobile = validated_data.get('mobile', instace.mobile)
        instace.landline = validated_data.get('landline', instace.landline)
        instace.fax_number = validated_data.get(
            'fax_number', instace.fax_number)
        instace.company_type = validated_data.get(
            'company_type', instace.company_type)
        instace.company_capital = validated_data.get(
            'company_capital', instace.company_capital)

        instace.save()
        return instace
