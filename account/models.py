from django.db import models
# from auditlog.registry import auditlog
from django.contrib.auth.models import AbstractUser, PermissionsMixin, BaseUserManager, Group, Permission
from django.utils.translation import ugettext_lazy as _
from datetime import datetime
from django.contrib.auth.hashers import (
    check_password, is_password_usable, make_password,
)
# Create your models here.


class AbTitles(models.Model):
    name = models.CharField(max_length=191)
    is_active = models.IntegerField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_titles'
        ordering = ['-updated_at']
        

class UserManager(BaseUserManager):
    """Define a model manager for User model with no username field."""

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """Create and save a User with the given email and password."""
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular User with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)

class AbUsers(AbstractUser, PermissionsMixin):
    username = None
    first_name = None
    last_name = None
    date_joined = None
    email = models.CharField(unique=True, max_length=191)
    email_verified = models.CharField(max_length=191, blank=True, null=True)
    password = models.CharField(max_length=191)
    is_active = models.IntegerField(default=True)
    remember_token = models.CharField(max_length=100, blank=True, null=True)
    stripe_id = models.CharField(max_length=191, blank=True, null=True)
    card_brand = models.CharField(max_length=191, blank=True, null=True)
    card_last_four = models.CharField(max_length=191, blank=True, null=True)
    trial_ends_at = models.DateTimeField(blank=True, null=True)
    transaction_id = models.CharField(max_length=191, blank=True, null=True)
    order_id = models.CharField(max_length=191, blank=True, null=True)
    trans_date = models.DateTimeField(blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)
    is_superuser = models.BooleanField(null=True, default=False)
    new_password = models.IntegerField(default=False)
    is_staff = models.BooleanField(_('staff status'), null=True, default=False,
        help_text=_('Designates whether the user can log into this admin '
                    'site.'))

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def check_password(self, raw_password):
        """
        Return a boolean of whether the raw_password was correct. Handles
        hashing formats behind the scenes.
        """
        def setter(raw_password):
            print(raw_password)
            self.set_password(raw_password)
            # Password hash upgrades shouldn't be considered password changes.
            self._password = None
            self.save(update_fields=["password"])

        # to match with old system - append bcrypt
        if not self.password.startswith('bcrypt$'):
            self.password = 'bcrypt${}'.format(self.password)

        return check_password(raw_password, self.password, setter)

    class Meta:
        managed = True
        db_table = 'ab_users'
        ordering = ['-updated_at']

class AbSubscribers(models.Model):
    name = models.CharField(max_length=191)
    email = models.CharField(unique=True, max_length=191)
    comments = models.TextField(blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_subscribers'
        ordering = ['-updated_at']

class AbSuggestions(models.Model):
    user = models.ForeignKey('AbUsers', models.DO_NOTHING)
    ENTITY_TYPE_CHOICES = (
        ('aircraft', 'Aircraft'),
        ('engine', 'Engine'),
        ('apu', 'APU'),
    )
    entity_type = models.CharField(choices=ENTITY_TYPE_CHOICES,max_length=8)
    category = models.CharField(max_length=191, blank=True, null=True)
    manufacturer = models.CharField(max_length=191, blank=True, null=True)
    type = models.CharField(max_length=191, blank=True, null=True)
    model = models.CharField(max_length=191, blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_suggestions'
        ordering = ['-updated_at']


# class AbRoles(models.Model):
#     name = models.CharField(max_length=191)
#     guard_name = models.CharField(max_length=191)
# created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
# updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

#     class Meta:
#         managed = True
#         db_table = 'ab_roles'
Group.add_to_class('created_at', models.DateTimeField(auto_now_add=True, blank=True, null=True))
Group.add_to_class('updated_at', models.DateTimeField(auto_now=True, blank=True, null=True))
Group.add_to_class('guard_name', models.CharField(blank=True, null=True, max_length=191))

# class AbPermissions(models.Model):
#     name = models.CharField(max_length=191)
#     guard_name = models.CharField(max_length=191)
#     created_at = models.DateTimeField(blank=True, null=True)
#     updated_at = models.DateTimeField(blank=True, null=True)

#     class Meta:
#         managed = True
#         db_table = 'ab_permissions'
Permission.add_to_class('guard_name', models.CharField(blank=True, null=True, max_length=191))
Permission.add_to_class('created_at', models.DateTimeField(auto_now_add=True,blank=True, null=True))
Permission.add_to_class('updated_at', models.DateTimeField(auto_now=True,blank=True, null=True))


# class AbRoleHasPermissions(models.Model):
#     permission = models.ForeignKey(AbPermissions, models.DO_NOTHING)
#     role = models.ForeignKey('AbRoles', models.DO_NOTHING)

#     class Meta:
#         managed = True
#         db_table = 'ab_role_has_permissions'
#         unique_together = (('permission', 'role'),)


# class AbRoleUser(models.Model):
#     user = models.ForeignKey('AbUsers', models.DO_NOTHING)
#     role = models.ForeignKey('AbRoles', models.DO_NOTHING)
#     created_at = models.DateTimeField(blank=True, null=True)
#     updated_at = models.DateTimeField(blank=True, null=True)

#     class Meta:
#         managed = True
#         db_table = 'ab_role_user'



# class AbPermissionUser(models.Model):
#     user = models.ForeignKey('AbUsers', models.DO_NOTHING)
#     permission = models.ForeignKey('AbPermissions', models.DO_NOTHING)
#     created_at = models.DateTimeField(blank=True, null=True)
#     updated_at = models.DateTimeField(blank=True, null=True)

#     class Meta:
#         managed = True
#         db_table = 'ab_permission_user'


class AbPasswordResets(models.Model):
    email = models.CharField(max_length=191)
    token = models.CharField(max_length=191)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)


    class Meta:
        managed = True
        db_table = 'ab_password_resets'


# class AbModelHasPermissions(models.Model):
#     permission = models.ForeignKey('AbPermissions', models.DO_NOTHING)
#     model_type = models.CharField(max_length=191)
#     model_id = models.BigIntegerField()

#     class Meta:
#         managed = True
#         db_table = 'ab_model_has_permissions'
#         unique_together = (('permission', 'model_id', 'model_type'),)


# class AbModelHasRoles(models.Model):
#     role = models.ForeignKey('AbRoles', models.DO_NOTHING)
#     model_type = models.CharField(max_length=191)
#     model_id = models.BigIntegerField()

#     class Meta:
#         managed = True
#         db_table = 'ab_model_has_roles'
#         unique_together = (('role', 'model_id', 'model_type'),)


class AbModels(models.Model):
    name = models.CharField(max_length=191)
    TYPE_CHOICES = (
        ('aircraft', 'Aircraft'),
        ('engine', 'Engine'),
        ('apu', 'Apu'),
        ('parts', 'Parts'),
    )
    type = models.CharField(choices=TYPE_CHOICES, max_length=8)
    type_0 = models.ForeignKey('AbTypes', models.CASCADE, db_column='type_id')  # Field renamed because of name conflict.
    is_active = models.IntegerField(default=True)
    description = models.TextField(blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_models'
        #unique_together = (('type', 'name'),)
        indexes = [
            models.Index(fields=['type']),
        ]
        ordering = ['-updated_at']

class AbManufacturers(models.Model):
    type = models.CharField(max_length=8)
    name = models.CharField(max_length=191)
    established = models.CharField(max_length=191, blank=True, null=True)
    country = models.ForeignKey('connect.AbCountries', models.DO_NOTHING, blank=True, null=True)
    is_active = models.IntegerField(default=True)
    description = models.TextField(blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_manufacturers'
        unique_together = (('type', 'name'),)
        ordering = ['-updated_at']

class AbTypes(models.Model):
    type = models.CharField(max_length=191)
    name = models.CharField(max_length=191)
    manufacturer = models.ForeignKey(AbManufacturers, models.CASCADE, blank=True, null=True)
    is_active = models.IntegerField(default=True)
    description = models.TextField(blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_types'
        ordering = ['-updated_at']

class AbSubscriptions(models.Model):
    user_id = models.PositiveIntegerField()
    name = models.CharField(max_length=191)
    stripe_id = models.CharField(max_length=191)
    stripe_plan = models.CharField(max_length=191)
    quantity = models.IntegerField()
    trial_ends_at = models.DateTimeField(blank=True, null=True)
    ends_at = models.DateTimeField(blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_subscriptions'
        ordering = ['-updated_at']


class AbAccesslogs(models.Model):
    user = models.ForeignKey('AbUsers', models.DO_NOTHING)
    payload = models.TextField(blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_accesslogs'
        ordering = ['-updated_at']


class AbAnalytics(models.Model):
    user = models.ForeignKey('AbUsers', models.DO_NOTHING)
    entity_id = models.PositiveIntegerField()
    type = models.ForeignKey('AbTypes', models.DO_NOTHING)
    view_count = models.IntegerField()
    search_count = models.IntegerField()
    is_active = models.IntegerField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_analytics'
        ordering = ['-updated_at']



# auditlog.register(AbTitles) 
# auditlog.register(AbUsers) 
# auditlog.register(AbSubscribers) 
# auditlog.register(AbSuggestions) 
# auditlog.register(AbPasswordResets) 
# auditlog.register(AbModels) 
# auditlog.register(AbManufacturers) 
# auditlog.register(AbTypes) 
# auditlog.register(AbSubscriptions) 
# auditlog.register(AbAnalytics) 
