from django.db import models
import os
from django.conf import settings
# from auditlog.registry import auditlog

# Create your models here.


class AbAdditionalFields(models.Model):
    entity_id = models.PositiveIntegerField()
    entity_type = models.CharField(max_length=191)
    field_name = models.CharField(max_length=191)
    field_value = models.CharField(max_length=191)
    is_active = models.IntegerField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_additional_fields'
        ordering = ['-updated_at']

class AbAdvertisements(models.Model):
    user = models.ForeignKey('account.AbUsers', models.DO_NOTHING)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    section = models.CharField(max_length=191, blank=True, null=True)
    is_active = models.IntegerField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_advertisements'
        ordering = ['-updated_at']

def attaches_upload(instance, filename):
    """ this function has to return the location to upload the file """
    return os.path.join('{}/{}/'.format(instance.path, filename))

class AbAttaches(models.Model):
    user = models.ForeignKey('account.AbUsers',models.DO_NOTHING, null=True)
    accessibility = models.IntegerField(default=False)
    attachable_type = models.CharField(max_length=191)
    attachable_id = models.IntegerField(blank=True)
    type = models.CharField(max_length=191, blank=True, null=True)
    path = models.CharField(max_length=191, blank=True)
    original_file_name = models.FileField(max_length=191, upload_to=attaches_upload)
    is_featured = models.IntegerField(default=False)
    is_active = models.IntegerField(default=False)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    def _delete_file(self):
       """ Deletes file from filesystem. """
       if os.path.isfile(self.original_file_name.path):
           os.remove(self.original_file_name.path)

    @staticmethod
    def get_attaches(instance, attach_type):
        abattaches = AbAttaches.objects.filter(attachable_type=attach_type, attachable_id=instance.id)
        attaches = []
        for abattache in abattaches:
            attache = {
                    "id" : abattache.id,
                    "user_id" : abattache.user_id,
                    "accessibility" : abattache.accessibility,
                    "attachable_id" : abattache.attachable_id,
                    "attachable_type" : abattache.attachable_type,
                    "path" : abattache.path,
                    "original_file_name" : abattache.original_file_name.name,
                    "is_featured" : abattache.is_featured,
                    "created_at" : abattache.created_at,
                    "updated_at" : abattache.updated_at,
                }
            attaches.append(attache)
        return attaches

    class Meta:
        managed = True
        db_table = 'ab_attaches'
        ordering = ['-updated_at']

class AbAttachments(models.Model):
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_attachments'
        ordering = ['-updated_at']

class AbCannedemails(models.Model):
    message_type = models.CharField(max_length=191)
    subject = models.CharField(max_length=191)
    sending_email = models.CharField(max_length=191)
    message = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=191)
    is_active = models.IntegerField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_cannedemails'
        ordering = ['-updated_at']

class AbKeywords(models.Model):
    keywords = models.TextField()
    entity_id = models.IntegerField()
    type = models.ForeignKey('account.AbTypes', models.DO_NOTHING)
    is_active = models.IntegerField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_keywords'
        ordering = ['-updated_at']

class AbNews(models.Model):
    title = models.CharField(max_length=191)
    date = models.DateField(blank=True, null=True)
    categories = models.ManyToManyField('AbCategories', related_name='categories',through='AbCategoryNews')
    #company_id = models.PositiveIntegerField(blank=True, null=True)
    company = models.ForeignKey('connect.AbCompanies', models.DO_NOTHING,blank=True, null=True)
    continent = models.ForeignKey('connect.AbContinents', models.DO_NOTHING)
    region = models.ForeignKey('connect.AbRegions', models.DO_NOTHING)
    #country_id = models.PositiveIntegerField(blank=True, null=True)
    country = models.ForeignKey('connect.AbCountries', models.DO_NOTHING, blank=True, null=True)
    source = models.TextField(blank=True, null=True)
    details = models.TextField(blank=True, null=True)
    is_active = models.IntegerField()
    views = models.IntegerField(default=False)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_news'
        ordering = ['-updated_at']


class AbPlans(models.Model):
    title = models.CharField(max_length=191)
    sub_title = models.CharField(max_length=191, blank=True, null=True)
    price_label = models.CharField(max_length=191, blank=True, null=True)
    price = models.DecimalField(max_digits=14, decimal_places=4, blank=True, null=True)
    discount = models.DecimalField(max_digits=14, decimal_places=4, blank=True, null=True)
    button_label = models.CharField(max_length=191, blank=True, null=True)
    aircraft_label = models.CharField(max_length=191, blank=True, null=True)
    aircraft_value = models.DecimalField(max_digits=14, decimal_places=4, blank=True, null=True)
    engine_label = models.CharField(max_length=191, blank=True, null=True)
    engine_value = models.DecimalField(max_digits=14, decimal_places=4, blank=True, null=True)
    apu_label = models.CharField(max_length=191, blank=True, null=True)
    apu_value = models.DecimalField(max_digits=14, decimal_places=4, blank=True, null=True)
    wanted_label = models.CharField(max_length=191, blank=True, null=True)
    wanted_value = models.DecimalField(max_digits=14, decimal_places=4, blank=True, null=True)
    parts_label = models.CharField(max_length=191, blank=True, null=True)
    parts_value = models.DecimalField(max_digits=14, decimal_places=4, blank=True, null=True)
    is_active = models.IntegerField(default=True, blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_plans'
        ordering = ['id']

class AbCustom(models.Model):
    plan = models.ForeignKey(AbPlans, on_delete=models.CASCADE,related_name='custom')
    label = models.CharField(max_length=191, blank=True, null=True)
    value = models.CharField(max_length=191, blank=True, null=True)
    main_heading = models.CharField(max_length=191)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'Ab_custom'
        ordering = ['-updated_at']

class AbPoints(models.Model):
    plan = models.ForeignKey(AbPlans, models.DO_NOTHING,related_name='points')
    POINTS_TYPE_CHOICES = (
        ('aircraft', 'Aircraft'),
        ('engine', 'Engine'),
        ('apu', 'APU'),
        ('part', 'Part'),
        ('wanted', 'Wanted'),
    )
    points_type = models.CharField(choices=POINTS_TYPE_CHOICES, max_length=8)
    number_points = models.IntegerField()
    point_text = models.TextField(blank=True, null=True)
    sub_text = models.CharField(max_length=200, blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_points'
        ordering = ['-updated_at']

class AbCredits(models.Model):
    user = models.ForeignKey('account.AbUsers', models.DO_NOTHING)
    plan = models.ForeignKey(AbPlans, models.DO_NOTHING)
    CREDITS_TYPE_CHOICES = (
        ('aircraft', 'Aircraft'),
        ('engine', 'Engine'),
        ('apu', 'APU'),
    )
    credits_type = models.CharField(choices=CREDITS_TYPE_CHOICES, max_length=8)
    value = models.IntegerField()
    is_active = models.IntegerField(default=False)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_credits'
        ordering = ['-updated_at']

class AbReleases(models.Model):
    name = models.CharField(max_length=191)
    is_active = models.IntegerField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_releases'
        ordering = ['-updated_at']

class AbSeos(models.Model):
    model_id = models.IntegerField()
    model_type = models.CharField(max_length=191)
    method = models.CharField(max_length=191, blank=True, null=True)
    url = models.CharField(max_length=45, blank=True, null=True)
    title = models.CharField(max_length=191)
    description = models.TextField()
    is_active = models.IntegerField()
    url = models.CharField(default=False, max_length=200)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_seos'
        ordering = ['-updated_at']

class AbSessions(models.Model):
    id = models.CharField(unique=True, max_length=191, primary_key=True)
    user_id = models.PositiveIntegerField(blank=True, null=True)
    ip_address = models.CharField(max_length=45, blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    payload = models.TextField()
    last_activity = models.IntegerField()

    class Meta:
        managed = True
        db_table = 'ab_sessions'

class AbViews(models.Model):
    viewable_id = models.IntegerField()
    viewable_type = models.CharField(max_length=191)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_views'
        ordering = ['-updated_at']


class AbCategories(models.Model):
    TYPE_CHOICES = (
        ('aircraft', 'aircraft'),
        ('engine', 'engine'),
        ('apu', 'apu'),
        ('parts', 'parts'),
        ('news', 'news'),
        ('event', 'event'),
    )
    type = models.CharField(choices=TYPE_CHOICES,max_length=8)
    name = models.CharField(max_length=191)
    manufacturers = models.ManyToManyField('account.AbManufacturers',related_name='categories', through='AbCategoryManufacturer')
    description = models.TextField(blank=True, null=True)
    is_active = models.IntegerField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_categories'
        unique_together = (('type', 'name'),)
        ordering = ['-updated_at']


class AbCategoryManufacturer(models.Model):
    manufacturer = models.ForeignKey('account.AbManufacturers', on_delete=models.CASCADE)
    category = models.ForeignKey(AbCategories, on_delete=models.CASCADE)

    class Meta:
        managed = True
        db_table = 'ab_category_manufacturer'

class AbCategoryNews(models.Model):
    news = models.ForeignKey('AbNews', models.CASCADE)
    category = models.ForeignKey(AbCategories, models.CASCADE)

    class Meta:
        managed = True
        db_table = 'ab_category_news'


class AbConfigurations(models.Model):
    name = models.CharField(max_length=191)
    is_active = models.IntegerField(default=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_configurations'
        ordering = ['-updated_at']

class AbOffers(models.Model):
    name = models.CharField(max_length=191)
    is_active = models.IntegerField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_offers'
        ordering = ['-updated_at']

class AbPaymentHistories(models.Model):
    user = models.ForeignKey('account.AbUsers', models.DO_NOTHING)
    transaction_id = models.IntegerField()
    order_id = models.IntegerField()
    response_code = models.IntegerField()
    response_message = models.TextField(blank=True, null=True)
    customer_name = models.CharField(max_length=191)
    customer_email = models.CharField(max_length=191)
    transaction_amount = models.DecimalField(max_digits=14, decimal_places=2)
    transaction_currency = models.CharField(max_length=191, blank=True, null=True)
    customer_phone = models.CharField(max_length=191, blank=True, null=True)
    first_4_digits = models.CharField(max_length=191, blank=True, null=True)
    last_4_digits = models.CharField(max_length=191, blank=True, null=True)
    card_brand = models.CharField(max_length=191, blank=True, null=True)
    trans_date = models.DateTimeField()
    pt_customer_email = models.CharField(max_length=191, blank=True, null=True)
    pt_customer_password = models.CharField(max_length=191, blank=True, null=True)
    pt_token = models.CharField(max_length=191, blank=True, null=True)
    secure_sign = models.CharField(max_length=191, blank=True, null=True)
    status = models.IntegerField(blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_payment_histories'
        ordering = ['-updated_at']

class AbPlanfeatures(models.Model):
    freaturable_type = models.CharField(max_length=191)
    freaturable_id = models.IntegerField()
    count = models.IntegerField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_planfeatures'
        ordering = ['-updated_at']

class AbCms(models.Model):
    url = models.CharField(max_length=191)
    section = models.CharField(max_length=191)
    title = models.CharField(max_length=191, blank=True, null=True)
    sub_title = models.CharField(max_length=191, blank=True, null=True)
    custom_url = models.CharField(max_length=191, blank=True, null=True)
    body = models.TextField(blank=True, null=True)
    is_active = models.IntegerField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_cms'
        ordering = ['-updated_at']


def media_upload(instance, filename):
    """ this function has to return the location to upload the file """
    return os.path.join('{}/{}/'.format(instance.path, filename))

class AbMedias(models.Model):
    user = models.ForeignKey('account.AbUsers', models.DO_NOTHING, blank=True, null=True)
    accessibility = models.IntegerField(default=False)
    mediable_type = models.CharField(max_length=191, blank=True)
    mediable_id = models.IntegerField(blank=True)
    type = models.CharField(max_length=191, blank=True, null=True)
    path = models.CharField(max_length=191)
    original_file_name = models.ImageField(max_length=191, upload_to=media_upload)
    meta_name = models.CharField(max_length=191, blank=True, null=True)
    is_featured = models.IntegerField(default=False)
    is_active = models.IntegerField(default=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    def _delete_file(self):
       """ Deletes file from filesystem. """
       if os.path.isfile(self.original_file_name.path):
           os.remove(self.original_file_name.path)

    @staticmethod
    def get_media(instance, media_type, multiple=False):
        abmedia = None
        abmedias = AbMedias.objects.filter(mediable_type=media_type, mediable_id=instance.id)
        if multiple:
            medias = []
            for media in abmedias:
                abmedia = {
                        "id" : media.id,
                        "user_id" : media.user_id,
                        "accessibility" : media.accessibility,
                        "path" : media.path,
                        "original_file_name" : media.original_file_name.name,
                        "is_featured" : media.is_featured,
                        "created_at" : media.created_at,
                        "updated_at" : media.updated_at,
                    }
                medias.append(abmedia)
            return medias
        else:
            if abmedias.exists():
                media = abmedias.first()
                abmedia = {
                    "user_id" : media.user_id,
                    "accessibility" : media.accessibility,
                    "path" : media.path,
                    "original_file_name" : media.original_file_name.name,
                    "is_featured" : media.is_featured,
                    "created_at" : media.created_at,
                    "updated_at" : media.updated_at,
                }
        return abmedia

    class Meta:
        managed = True
        db_table = 'ab_medias'
        ordering = ['-updated_at']

# auditlog.register(AbAdditionalFields)
# auditlog.register(AbAdvertisements)
# auditlog.register(AbAttaches)
# auditlog.register(AbAttachments)
# auditlog.register(AbCannedemails)
# auditlog.register(AbKeywords)
# auditlog.register(AbNews)
# auditlog.register(AbPlans)
# auditlog.register(AbPoints)
# auditlog.register(AbReleases)
# auditlog.register(AbSeos)
# auditlog.register(AbSessions)
# auditlog.register(AbViews)
# auditlog.register(AbCategories)
# auditlog.register(AbCategoryNews)
# auditlog.register(AbCategoryManufacturer)
# auditlog.register(AbConfigurations)
# auditlog.register(AbOffers)
# auditlog.register(AbPaymentHistories)
# auditlog.register(AbPlanfeatures)
# auditlog.register(AbCms)
# auditlog.register(AbMedias)
