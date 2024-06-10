from django.db import models

from django.contrib.auth.base_user import BaseUserManager

from django.utils.translation import gettext_lazy as _

from django.contrib.auth.models import AbstractUser, User
import datetime
# Create your views here.

class CustomUserManager(BaseUserManager):
    """
    Custom user model manager where email is the unique identifiers
    for authentication instead of usernames.
    """
    def create_user(self, email, password, **extra_fields):
        """
        Create and save a user with the given email and password.
        """
        if not email:
            raise ValueError(_("The Email must be set"))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        """
        Create and save a SuperUser with the given email and password.
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Superuser must have is_staff=True."))
        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("Superuser must have is_superuser=True."))
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(_("email address"), unique=True)
    verified=models.BooleanField(default=True)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
    objects = CustomUserManager()
    def _str_(self):
        return self.email


class Company(models.Model):
    name = models.CharField(max_length=100,null=True)
    location = models.TextField(null=True)
    city = models.CharField(max_length=255,null=True)
    fax_number = models.CharField(max_length=255,null=True)
    mobile = models.CharField(max_length=255,null=True)
    landline = models.CharField(max_length=255,null=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    company_type_tego = models.CharField(max_length=30,null=True)
    company_field= models.CharField(max_length=255)

    def __str__(self):
        return f"company {self.name}"

    @property
    def owners(self):
        return self.owner_set.all()

    @property
    def supplier(self):
        return self.supplier_set.first()


class Supplier(models.Model):
    company = models.OneToOneField(Company, on_delete=models.CASCADE)
    tax_card_number = models.CharField(max_length=255,null=True)
    commercial_registration_number = models.CharField(max_length=255,null=True)
    company_type = models.CharField(max_length=255,null=True)
    company_capital = models.IntegerField(null=True)
    def _str_(self):
        return f"supplier {self.company.name}"


class Owner(models.Model):
    name = models.CharField(max_length=100,null=True)
    owner_id = models.CharField(max_length=20,null=True)
    onwer_position = models.CharField(max_length=255,null=True)
    address = models.CharField(max_length=255,null=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, null=True)
    def _str_(self):
        return self.name


class UserNotification(models.Model):
    recipient = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name='recipient')
    message = models.CharField(max_length=255, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    seen = models.BooleanField(default=False)
    def _str_(self):
        return f"{self.message}->{self.recipient}"


class TenderAd(models.Model):
    title=models.TextField()
    topic=models.TextField()
    field=models.CharField(max_length=255)
    deadline=models.DateField()
    finalInsurance=models.FloatField()

class Tender(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    initial_price = models.IntegerField()
    status = models.CharField(max_length=50)
    date_created = models.DateTimeField(auto_now_add=True)
    ad = models.OneToOneField(TenderAd, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.id}->{self.user}"

    @property
    def admins(self):
        return self.tenderadmin_set.all()

    @property
    def public_conditions(self):
        return self.tenderpublicconditions_set.all()

    @property
    def private_conditions(self):
        return self.tenderprivateconditions_set.all()

    @property
    def products(self):
        return self.tenderproduct_set.all()


class TenderAdmin(models.Model):
    name = models.CharField(max_length=255)
    job_title = models.CharField(max_length=255)
    tender = models.ForeignKey(Tender, on_delete=models.CASCADE)
    def __str__(self):
        return f"{self.name}->{self.tender}"

class TenderPublicConditions(models.Model):

    condition = models.TextField()
    tender = models.ForeignKey(Tender, on_delete=models.CASCADE)


class TenderPrivateConditions(models.Model):

    condition = models.TextField()
    tender = models.ForeignKey(Tender, on_delete=models.CASCADE)


class TenderProduct(models.Model):

    title = models.CharField(max_length=255)
    quantity_unit = models.CharField(max_length=255)
    quantity = models.CharField(max_length=255)
    description = models.TextField()
    tender = models.ForeignKey(Tender, on_delete=models.CASCADE)
    def __str__(self):
        return f"{self.id}- {self.title}-> Tender {self.tender.id}"

class TenderResponse(models.Model):

    offered_price = models.FloatField()
    status = models.CharField(max_length=255)
    score=models.FloatField(null=True)
    tender = models.ForeignKey(Tender, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    class Meta:
        unique_together = ('user', 'tender')
    def __str__(self):
        return f"{self.id}- {self.user}->Tender {self.tender.id}"
    @property
    def offer_products(self):
        return self.responseproductbid_set.all()
    @property
    def offer_conditions(self):
        return self.responseprivatecondition_set.all()
    @property
    def previous_work(self):
        return self.responsepreviouswork_set.all()

class ResponsePreviousWork(models.Model):
    title=models.CharField()
    description=models.TextField()
    response = models.ForeignKey(TenderResponse, on_delete=models.CASCADE)


class ResponseProductBid(models.Model):
    product = models.ForeignKey(TenderProduct, on_delete=models.CASCADE)
    provided_quantity = models.IntegerField(null=True)
    supplying_status = models.CharField()
    price = models.FloatField(null=True,blank=True)
    product_title=models.CharField(max_length=255)
    product_description = models.TextField(null=True)
    response = models.ForeignKey(TenderResponse, on_delete=models.CASCADE)

class Transaction(models.Model):
    response=models.ForeignKey(TenderResponse, on_delete=models.CASCADE)
    tender=models.ForeignKey(Tender, on_delete=models.CASCADE)
    product_review_date= models.DateField(null=True)
    product_review_date_status=models.CharField(null=True)
    product_review_status =models.CharField(null=True)
    transaction_date= models.DateTimeField(auto_now_add=True)
    class Meta:
        unique_together = ('tender', 'response')
    # @property
    # def original_product(self):
    #     return self.product.

    # def __str__(self):
    #     return f"{self.id}- {self.product.title} {self.product.id}-> Tender {self.response.tender.id}"

class ResponsePrivateCondition(models.Model):
    offered_condition=models.CharField(max_length=255,blank=True,null=True)
    condition = models.ForeignKey(TenderPrivateConditions,on_delete=models.CASCADE)
    response = models.ForeignKey(TenderResponse, on_delete=models.CASCADE)
