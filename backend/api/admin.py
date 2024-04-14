from django.contrib import admin

from .models import CustomUser, Company, Owner, Supplier, UserNotification, Tender, TenderProduct, TenderAdmin, TenderPublicConditions, TenderPrivateConditions

from django.contrib.auth.admin import UserAdmin

from . import models

# from django.contrib.auth.models import User


# Register your models here.

admin.site.register(CustomUser)

admin.site.register(Company)

admin.site.register(Owner)

admin.site.register(Supplier)

admin.site.register(UserNotification)
admin.site.register(Tender)

admin.site.register(TenderProduct)

admin.site.register(TenderAdmin)

admin.site.register(TenderPublicConditions)

admin.site.register(TenderPrivateConditions)
admin.site.register(models.TenderResponse)

admin.site.register(models.ResponseProductBid)

admin.site.register(models.ResponsePrivateCondition)
