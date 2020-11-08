from django.db import models
from django.core import serializers
# from auditlog.registry import auditlog

# Create your models here.

class AbCompanies(models.Model):
    name = models.CharField(max_length=191)
    status = models.IntegerField(default=0)
    profile = models.TextField(blank=True, null=True)
    zip_code = models.CharField(max_length=191, blank=True, null=True)
    po_box = models.CharField(max_length=191, blank=True, null=True)
    business_phone = models.CharField(max_length=191, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    country = models.ForeignKey('AbCountries', models.DO_NOTHING,blank=True, null=True)
    city = models.ForeignKey('AbCities', models.DO_NOTHING,blank=True, null=True)
    state = models.ForeignKey('AbStates', models.DO_NOTHING,blank=True, null=True)
    logo = models.TextField(blank=True, null=True)
    website = models.TextField(blank=True, null=True)
    is_active = models.IntegerField()
    is_published = models.IntegerField(default=0)
    views = models.IntegerField(default=False)
    rfq_email = models.CharField(max_length=191, blank=True, null=True)
    aog_email = models.CharField(max_length=191, blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_companies'
        ordering = ['-updated_at']

    # @staticmethod
    # def available_companies(contact):
    #     ''' Returns a User Agent that will be seen by the website. '''
    #     available_companies = AbCompanies.objects.exclude(id__in=AbContacts.objects.filter(company_id__isnull=False).exclude(id=contact.id).values_list('company_id', flat=True)).values('id','name')
    #     return list(available_companies)

class AbSpecialities(models.Model):
    name = models.CharField(unique=True, max_length=191)
    companies = models.ManyToManyField('AbCompanies', related_name='specialities',through='AbCompanySpeciality')
    is_active = models.IntegerField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_specialities'

class AbCompanySpeciality(models.Model):
    company = models.ForeignKey(AbCompanies, models.CASCADE)
    speciality = models.ForeignKey('AbSpecialities', models.CASCADE)

    class Meta:
        managed = True
        db_table = 'ab_company_speciality'

class AbConnections(models.Model):
    user = models.ForeignKey('account.AbUsers', models.DO_NOTHING, related_name="connection_user")
    conected_user = models.ForeignKey('account.AbUsers', models.DO_NOTHING, related_name="connected_user")
    is_active = models.IntegerField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_connections'
        ordering = ['-updated_at']

class AbContinents(models.Model):
    name = models.CharField(unique=True, max_length=191)
    is_active = models.IntegerField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_continents'
        ordering = ['-updated_at']

class AbRegions(models.Model):
    name = models.CharField(max_length=191)
    continent = models.ForeignKey(AbContinents, models.DO_NOTHING)
    is_active = models.IntegerField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_regions'
        ordering = ['-updated_at']

class AbCountries(models.Model):
    name = models.CharField(max_length=191)
    continent = models.ForeignKey(AbContinents, models.DO_NOTHING, blank=True, null=True)
    region = models.ForeignKey('AbRegions', models.DO_NOTHING, blank=True, null=True)
    capital = models.CharField(max_length=191, blank=True, null=True)
    currency = models.CharField(max_length=191, blank=True, null=True)
    iso_3116_alpha_2 = models.CharField(max_length=191, blank=True, null=True)
    dialing_code = models.CharField(max_length=191, blank=True, null=True)
    flag = models.TextField(blank=True, null=True)
    is_active = models.IntegerField(default=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_countries'
        ordering = ['-updated_at']

class AbContactQueries(models.Model):
    name = models.CharField(max_length=191)
    email = models.CharField(max_length=191)
    phone = models.CharField(max_length=191)
    country = models.ForeignKey('AbCountries', models.DO_NOTHING)
    ENQURIES_CHOICES = (
        ('feedback','Feedback'),
        ('help','Help'),
        ('problem','Problem'),
        ('suggestion ','Suggestion '),
    )
    enquiry_type = models.CharField(choices=ENQURIES_CHOICES,max_length=11,blank=True, null=True)
    STATUS_CHOICES = (
        ('solved', 'Solved'),
        ('on hold', 'On hold'),
    )
    status = models.CharField(choices=STATUS_CHOICES, max_length=11,blank=True, null=True)
    message = models.TextField()
    is_active = models.IntegerField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_contact_queries'

class AbDepartments(models.Model):
    name = models.CharField(max_length=191)
    type = models.CharField(max_length=191)
    is_active = models.IntegerField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_departments'
        ordering = ['-updated_at']
        
class AbStates(models.Model):
    name = models.CharField(max_length=191)
    country = models.ForeignKey(AbCountries, models.DO_NOTHING, blank=True, null=True)
    is_active = models.IntegerField(default=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_states'
        ordering = ['-updated_at']

class AbCities(models.Model):
    name = models.CharField(max_length=191)
    state = models.ForeignKey('AbStates', models.DO_NOTHING, blank=True, null=True)
    is_active = models.IntegerField(default=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_cities'
        ordering = ['-updated_at']
        
class AbContacts(models.Model):
    creator = models.ForeignKey('account.AbUsers', models.DO_NOTHING, related_name='creator')
    email = models.CharField(max_length=191)
    TITLE_CHOICES = (
        ('MrMs', 'Mr/Ms'),
        ('Esq', 'Esq'),
        ('Hon', 'Hon'),
        ('Jr', 'Jr'),
        ('Dr', 'Dr'),
        ('Mrs', 'Mrs'),
        ('Mr', 'Mr'),
        ('Ms', 'Ms'),
        ('Messrs', 'Messrs'),
        ('Mmes', 'Mmes'),
        ('Msgr', 'Msgr'),
        ('Prof', 'Prof'),
        ('Rev', 'Rev'),
        ('Rt. Hon', 'Rt. Hon'),
        ('Sr', 'Sr'),
        ('St', 'St'),
    )
    title = models.CharField(choices=TITLE_CHOICES,max_length=7)
    company = models.ForeignKey('AbCompanies', models.DO_NOTHING, blank=True, null=True, related_name='contact')
    user = models.ForeignKey('account.AbUsers', blank=True, null=True, related_name='contact', on_delete=models.CASCADE)
    first_name = models.CharField(max_length=191)
    last_name = models.CharField(max_length=191)
    GENDER_CHOICES = (
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    )
    gender = models.CharField(choices=GENDER_CHOICES,max_length=6)
    birthday = models.CharField(max_length=191, blank=True, null=True)
    job_title = models.ForeignKey('account.AbTitles', models.DO_NOTHING, db_column='job_title', blank=True, null=True)
    department = models.ForeignKey(AbDepartments, models.DO_NOTHING, blank=True, null=True)
    business_phone = models.CharField(max_length=191, blank=True, null=True)
    mobile_phone = models.CharField(max_length=191, blank=True, null=True)
    skype = models.CharField(max_length=191, blank=True, null=True)
    linkedin = models.CharField(max_length=191, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    city = models.ForeignKey(AbCities, models.DO_NOTHING, blank=True, null=True)
    country = models.ForeignKey(AbCountries, models.DO_NOTHING, blank=True, null=True)
    state = models.ForeignKey(AbStates, models.DO_NOTHING, blank=True, null=True)
    religion = models.CharField(max_length=191, blank=True, null=True)
    CONTACT_CHOICES = (
        ('Email', 'Email'),
        ('Phone', 'Phone'),
        ('Both', 'Both'),
    )
    preferred_contact_method = models.CharField(choices=CONTACT_CHOICES,max_length=5, blank=True, null=True)
    message = models.TextField(blank=True, null=True)
    contact_date = models.DateTimeField(blank=True, null=True)
    is_published = models.IntegerField(blank=True, null=True)
    is_primary = models.IntegerField(default=False, null=True)
    is_public = models.IntegerField(blank=True, null=True)
    views = models.IntegerField(default=False)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_contacts'
        ordering = ['-updated_at']

class AbContents(models.Model):
    user = models.ForeignKey('account.AbUsers', models.DO_NOTHING)
    path = models.CharField(max_length=191)
    title = models.CharField(max_length=191, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_contents'
        ordering = ['-updated_at']

class AbFavourites(models.Model):
    favouritable_id = models.IntegerField()
    favouritable_type = models.CharField(max_length=191)
    user = models.ForeignKey('account.AbUsers', models.DO_NOTHING)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_favourites'
        unique_together = (('favouritable_id', 'favouritable_type', 'user'),)
        ordering = ['-updated_at']

class AbImageGalleries(models.Model):
    title = models.CharField(max_length=191, blank=True, null=True)
    name = models.CharField(max_length=191, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    is_active = models.IntegerField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_image_galleries'
        ordering = ['-updated_at']

class AbLeads(models.Model):
    leadable_type = models.CharField(max_length=191)
    leadable = models.ForeignKey('account.AbUsers', models.DO_NOTHING)
    user = models.ForeignKey('account.AbUsers', models.DO_NOTHING, related_name='user_lead')
    creator = models.ForeignKey('account.AbUsers', models.DO_NOTHING,related_name='creator_lead')
    LEAD_STATUS_CHOICES = (
        ('Read', 'Read'),
        ('Unread', 'Unread'),
    )
    lead_status = models.CharField(choices=LEAD_STATUS_CHOICES,max_length=6)
    message = models.TextField(blank=True, null=True)
    is_active = models.IntegerField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_leads'
        ordering = ['-updated_at']

class AbLikes(models.Model):
    likable_id = models.IntegerField()
    likable_type = models.CharField(max_length=191)
    user = models.ForeignKey('account.AbUsers', models.DO_NOTHING)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_likes'
        unique_together = (('likable_id', 'likable_type', 'user'),)
        ordering = ['-updated_at']
        

# auditlog.register(AbCompanies) 
# auditlog.register(AbSpecialities) 
# auditlog.register(AbCompanySpeciality) 
# auditlog.register(AbConnections) 
# auditlog.register(AbContinents) 
# auditlog.register(AbRegions) 
# auditlog.register(AbCountries) 
# auditlog.register(AbContacts) 
# auditlog.register(AbContents) 
# auditlog.register(AbDepartments) 
# auditlog.register(AbFavourites) 
# auditlog.register(AbImageGalleries) 
# auditlog.register(AbLeads) 
# auditlog.register(AbLikes) 
# auditlog.register(AbStates) 
# auditlog.register(AbCities) 
