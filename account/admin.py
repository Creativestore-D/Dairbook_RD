from django.contrib import admin
from account import models
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from django.utils.translation import ugettext_lazy as _


@admin.register(models.AbUsers)
class UserAdmin(DjangoUserAdmin):
    """Define admin model for custom User model with no email field."""

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser',
                                       'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )
    search_fields = ('email',)
    ordering = ('email',)

admin.site.register(models.AbTitles)
admin.site.register(models.AbSubscribers)
admin.site.register(models.AbSuggestions)
admin.site.register(models.AbPasswordResets)
admin.site.register(models.AbModels)
admin.site.register(models.AbManufacturers)
admin.site.register(models.AbTypes)
admin.site.register(models.AbSubscriptions)
admin.site.register(models.AbAnalytics)
