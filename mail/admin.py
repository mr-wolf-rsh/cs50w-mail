from django.contrib import admin
from .models import Email, User

# Register your models here.


class EmailAdmin(admin.ModelAdmin):
    list_display = [
        field.name for field in Email._meta.concrete_fields if field.name != 'body']
    filter_horizontal = ("recipients",)


admin.site.register(Email, EmailAdmin)


class UserAdmin(admin.ModelAdmin):
    list_display = [
        field.name for field in User._meta.concrete_fields if field.name != 'password']


admin.site.register(User, UserAdmin)
