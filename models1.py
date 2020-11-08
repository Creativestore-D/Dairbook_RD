# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AbAccesslogs(models.Model):
    user = models.ForeignKey('AbUsers', models.CASCADE)
    payload = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_accesslogs'


class AbAdditionalFields(models.Model):
    entity_id = models.PositiveIntegerField()
    entity_type = models.CharField(max_length=191)
    field_name = models.CharField(max_length=191)
    field_value = models.CharField(max_length=191)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_additional_fields'


class AbAdvertisements(models.Model):
    title = models.CharField(max_length=191)
    height = models.CharField(max_length=191, blank=True, null=True)
    width = models.CharField(max_length=191, blank=True, null=True)
    section = models.CharField(max_length=191, blank=True, null=True)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_advertisements'


class AbAircrafts(models.Model):
    title = models.CharField(max_length=191)
    uid = models.CharField(max_length=191)
    user = models.ForeignKey('AbUsers', models.DO_NOTHING)
    category = models.ForeignKey('AbCategories', models.DO_NOTHING)
    type = models.ForeignKey('AbTypes', models.DO_NOTHING)
    model_id = models.PositiveIntegerField(blank=True, null=True)
    manufacturer = models.ForeignKey('AbManufacturers', models.DO_NOTHING)
    msn = models.CharField(db_column='MSN', max_length=191)  # Field name made lowercase.
    yom = models.CharField(db_column='YOM', max_length=191)  # Field name made lowercase.
    seating_first_class = models.IntegerField(blank=True, null=True)
    seating_business = models.IntegerField(blank=True, null=True)
    seating_economy = models.IntegerField(blank=True, null=True)
    offer_for = models.CharField(max_length=14)
    mgh = models.IntegerField(blank=True, null=True)
    per_block_hour = models.FloatField(blank=True, null=True)
    cpd = models.FloatField(blank=True, null=True)
    price = models.DecimalField(max_digits=14, decimal_places=4, blank=True, null=True)
    terms = models.TextField(blank=True, null=True)
    availability = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=13)
    registration_country = models.IntegerField(blank=True, null=True)
    registration_number = models.TextField(blank=True, null=True)
    owner_id = models.IntegerField(blank=True, null=True)
    previous_operator = models.IntegerField(blank=True, null=True)
    current_operator = models.IntegerField(blank=True, null=True)
    manager_id = models.IntegerField(blank=True, null=True)
    seller_id = models.IntegerField(blank=True, null=True)
    primary_contact = models.IntegerField(blank=True, null=True)
    current_location = models.IntegerField(blank=True, null=True)
    configuration_id = models.IntegerField(blank=True, null=True)
    tsn = models.IntegerField(blank=True, null=True)
    csn = models.IntegerField(blank=True, null=True)
    mtow = models.IntegerField(blank=True, null=True)
    mlgw = models.IntegerField(blank=True, null=True)
    last_c_check = models.DateTimeField(blank=True, null=True)
    promotion_date = models.DateTimeField(blank=True, null=True)
    compliance = models.CharField(max_length=4, blank=True, null=True)
    engine_type_id = models.IntegerField(blank=True, null=True)
    engine_model_id = models.IntegerField(blank=True, null=True)
    engine_manufacturer_id = models.IntegerField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    promote_status = models.IntegerField()
    views = models.IntegerField()
    likes = models.IntegerField()
    isactivestatus = models.CharField(db_column='isActiveStatus', max_length=16)  # Field name made lowercase.
    status_reason = models.TextField(blank=True, null=True)
    is_featured = models.IntegerField()
    is_active_by_user = models.IntegerField()
    is_published = models.IntegerField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_aircrafts'


class AbAirfieldTypes(models.Model):
    name = models.CharField(max_length=191)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_airfield_types'


class AbAirports(models.Model):
    name = models.CharField(max_length=191)
    user = models.ForeignKey('AbUsers', models.DO_NOTHING)
    city_id = models.IntegerField(blank=True, null=True)
    country = models.ForeignKey('AbCountries', models.DO_NOTHING, blank=True, null=True)
    state = models.ForeignKey('AbStates', models.DO_NOTHING, blank=True, null=True)
    iata_code = models.CharField(max_length=191, blank=True, null=True)
    icao_code = models.CharField(max_length=191, blank=True, null=True)
    airfield_type = models.ForeignKey(AbAirfieldTypes, models.DO_NOTHING)
    time_zone = models.CharField(max_length=191, blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    elevation = models.FloatField(blank=True, null=True)
    gps_code = models.FloatField(blank=True, null=True)
    iso_country = models.CharField(max_length=191, blank=True, null=True)
    sunrise = models.CharField(max_length=191, blank=True, null=True)
    sunset = models.CharField(max_length=191, blank=True, null=True)
    views = models.IntegerField(blank=True, null=True)
    is_active = models.IntegerField()
    is_published = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_airports'


class AbAlternateparts(models.Model):
    part_number = models.CharField(max_length=191)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_alternateparts'


class AbAnalytics(models.Model):
    user = models.ForeignKey('AbUsers', models.DO_NOTHING)
    entity_id = models.PositiveIntegerField()
    type = models.ForeignKey('AbTypes', models.DO_NOTHING)
    view_count = models.IntegerField()
    search_count = models.IntegerField()
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_analytics'


class AbApus(models.Model):
    uid = models.CharField(max_length=191)
    title = models.CharField(max_length=191)
    user = models.ForeignKey('AbUsers', models.DO_NOTHING)
    category = models.ForeignKey('AbCategories', models.DO_NOTHING)
    manufacturer = models.ForeignKey('AbManufacturers', models.DO_NOTHING)
    type = models.ForeignKey('AbTypes', models.DO_NOTHING)
    model_id = models.PositiveIntegerField(blank=True, null=True)
    offer_for = models.CharField(max_length=14)
    serial_number = models.CharField(max_length=191)
    part_number = models.CharField(max_length=191, blank=True, null=True)
    status = models.CharField(max_length=15, blank=True, null=True)
    availability = models.DateTimeField(blank=True, null=True)
    price = models.DecimalField(max_digits=14, decimal_places=4, blank=True, null=True)
    lease_terms = models.TextField(blank=True, null=True)
    exchange_terms = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    current_location = models.PositiveIntegerField(blank=True, null=True)
    owner_id = models.PositiveIntegerField(blank=True, null=True)
    seller_id = models.PositiveIntegerField(blank=True, null=True)
    primary_contact = models.ForeignKey('AbContacts', models.DO_NOTHING, db_column='primary_contact')
    thrust_rating = models.CharField(max_length=191, blank=True, null=True)
    lsv_description = models.TextField(blank=True, null=True)
    status_reason = models.TextField(blank=True, null=True)
    promote_status = models.IntegerField()
    views = models.IntegerField()
    likes = models.IntegerField()
    promotion_date = models.DateTimeField(blank=True, null=True)
    isactivestatus = models.CharField(db_column='isActiveStatus', max_length=16)  # Field name made lowercase.
    is_featured = models.IntegerField()
    is_active_by_user = models.IntegerField()
    is_published = models.IntegerField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    cycle_remaining = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_apus'


class AbAttaches(models.Model):
    user_id = models.IntegerField(blank=True, null=True)
    accessibility = models.IntegerField()
    attachable_type = models.CharField(max_length=191)
    attachable_id = models.IntegerField()
    type = models.CharField(max_length=191, blank=True, null=True)
    path = models.CharField(max_length=191)
    original_file_name = models.CharField(max_length=191)
    is_featured = models.IntegerField()
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_attaches'


class AbAttachments(models.Model):
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_attachments'


class AbCannedemails(models.Model):
    message_type = models.CharField(max_length=191)
    subject = models.CharField(max_length=191)
    sending_email = models.CharField(max_length=191)
    message = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=191)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_cannedemails'


class AbCategories(models.Model):
    type = models.CharField(max_length=8)
    name = models.CharField(max_length=191)
    description = models.TextField(blank=True, null=True)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_categories'


class AbCategoryEvent(models.Model):
    event = models.ForeignKey('AbEvents', models.DO_NOTHING)
    category = models.ForeignKey(AbCategories, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'ab_category_event'


class AbCategoryManufacturer(models.Model):
    manufacturer = models.ForeignKey('AbManufacturers', models.DO_NOTHING)
    category = models.ForeignKey(AbCategories, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'ab_category_manufacturer'


class AbCategoryNews(models.Model):
    news = models.ForeignKey('AbNews', models.DO_NOTHING)
    category = models.ForeignKey(AbCategories, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'ab_category_news'


class AbCities(models.Model):
    name = models.CharField(max_length=191)
    state = models.ForeignKey('AbStates', models.DO_NOTHING)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_cities'


class AbCms(models.Model):
    url = models.CharField(max_length=191)
    section = models.CharField(max_length=191)
    title = models.CharField(max_length=191, blank=True, null=True)
    sub_title = models.CharField(max_length=191, blank=True, null=True)
    custom_url = models.CharField(max_length=191, blank=True, null=True)
    body = models.TextField(blank=True, null=True)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_cms'


class AbCompanies(models.Model):
    name = models.CharField(max_length=191)
    status = models.IntegerField()
    profile = models.TextField(blank=True, null=True)
    zip_code = models.CharField(max_length=191, blank=True, null=True)
    po_box = models.CharField(max_length=191, blank=True, null=True)
    business_phone = models.CharField(max_length=191, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    city_id = models.PositiveIntegerField(blank=True, null=True)
    state_id = models.PositiveIntegerField(blank=True, null=True)
    country_id = models.PositiveIntegerField(blank=True, null=True)
    logo = models.TextField(blank=True, null=True)
    website = models.TextField(blank=True, null=True)
    is_active = models.IntegerField()
    is_published = models.IntegerField()
    views = models.IntegerField()
    rfq_email = models.CharField(max_length=191, blank=True, null=True)
    aog_email = models.CharField(max_length=191, blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_companies'


class AbCompanySpeciality(models.Model):
    company = models.ForeignKey(AbCompanies, models.DO_NOTHING)
    speciality = models.ForeignKey('AbSpecialities', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'ab_company_speciality'


class AbConditions(models.Model):
    name = models.CharField(max_length=191)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_conditions'


class AbConfigurations(models.Model):
    name = models.CharField(max_length=191)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_configurations'


class AbConnections(models.Model):
    user = models.ForeignKey('AbUsers', models.DO_NOTHING)
    conected_user = models.ForeignKey('AbUsers', models.DO_NOTHING)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_connections'


class AbContactQueries(models.Model):
    name = models.CharField(max_length=191)
    email = models.CharField(max_length=191)
    phone = models.CharField(max_length=191)
    country = models.ForeignKey('AbCountries', models.DO_NOTHING)
    message = models.TextField()
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_contact_queries'


class AbContacts(models.Model):
    creator = models.ForeignKey('AbUsers', models.DO_NOTHING)
    email = models.CharField(max_length=191)
    title = models.CharField(max_length=7)
    company_id = models.PositiveIntegerField(blank=True, null=True)
    user_id = models.PositiveIntegerField(blank=True, null=True)
    first_name = models.CharField(max_length=191)
    last_name = models.CharField(max_length=191)
    gender = models.CharField(max_length=6)
    birthday = models.CharField(max_length=191, blank=True, null=True)
    job_title = models.PositiveIntegerField(blank=True, null=True)
    department_id = models.PositiveIntegerField(blank=True, null=True)
    business_phone = models.CharField(max_length=191, blank=True, null=True)
    mobile_phone = models.CharField(max_length=191, blank=True, null=True)
    skype = models.CharField(max_length=191, blank=True, null=True)
    linkedin = models.CharField(max_length=191, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    city_id = models.PositiveIntegerField(blank=True, null=True)
    country_id = models.PositiveIntegerField(blank=True, null=True)
    state_id = models.PositiveIntegerField(blank=True, null=True)
    religion = models.CharField(max_length=191, blank=True, null=True)
    preferred_contact_method = models.CharField(max_length=5, blank=True, null=True)
    message = models.TextField(blank=True, null=True)
    contact_date = models.DateTimeField(blank=True, null=True)
    is_published = models.IntegerField()
    is_primary = models.IntegerField()
    is_public = models.IntegerField()
    views = models.IntegerField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_contacts'


class AbContents(models.Model):
    user = models.ForeignKey('AbUsers', models.DO_NOTHING)
    path = models.CharField(max_length=191)
    title = models.CharField(max_length=191, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_contents'


class AbContinents(models.Model):
    name = models.CharField(max_length=191)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_continents'


class AbCountries(models.Model):
    name = models.CharField(max_length=191)
    continent = models.ForeignKey(AbContinents, models.DO_NOTHING)
    region = models.ForeignKey('AbRegions', models.DO_NOTHING)
    currency = models.CharField(max_length=191, blank=True, null=True)
    iso_3116_alpha_2 = models.CharField(max_length=191, blank=True, null=True)
    dialing_code = models.CharField(max_length=191, blank=True, null=True)
    flag = models.TextField(blank=True, null=True)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    capital = models.CharField(max_length=200, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_countries'


class AbDepartments(models.Model):
    name = models.CharField(max_length=191)
    type = models.CharField(max_length=191)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_departments'


class AbEngines(models.Model):
    uid = models.CharField(max_length=191)
    title = models.CharField(max_length=191, blank=True, null=True)
    user = models.ForeignKey('AbUsers', models.DO_NOTHING)
    manufacturer = models.ForeignKey('AbManufacturers', models.DO_NOTHING)
    category = models.ForeignKey(AbCategories, models.DO_NOTHING)
    type = models.ForeignKey('AbTypes', models.DO_NOTHING)
    model_id = models.PositiveIntegerField(blank=True, null=True)
    offer_for = models.CharField(max_length=14)
    esn = models.CharField(max_length=191, blank=True, null=True)
    status = models.CharField(max_length=15, blank=True, null=True)
    availability = models.DateTimeField(blank=True, null=True)
    price = models.DecimalField(max_digits=14, decimal_places=4, blank=True, null=True)
    lease_terms = models.TextField(blank=True, null=True)
    exchange_terms = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    owner_id = models.PositiveIntegerField(blank=True, null=True)
    seller_id = models.PositiveIntegerField(blank=True, null=True)
    primary_contact = models.ForeignKey(AbContacts, models.DO_NOTHING, db_column='primary_contact')
    thrust_rating = models.CharField(max_length=191, blank=True, null=True)
    lsv_description = models.TextField(blank=True, null=True)
    tso = models.TextField(blank=True, null=True)
    status_reason = models.TextField(blank=True, null=True)
    promotion_date = models.DateTimeField(blank=True, null=True)
    views = models.IntegerField()
    likes = models.IntegerField()
    isactivestatus = models.CharField(db_column='isActiveStatus', max_length=16)  # Field name made lowercase.
    is_featured = models.IntegerField()
    is_active_by_user = models.IntegerField()
    is_published = models.IntegerField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    cycle_remaining = models.IntegerField(blank=True, null=True)
    current_location = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_engines'


class AbEvents(models.Model):
    title = models.CharField(max_length=191)
    continent = models.ForeignKey(AbContinents, models.DO_NOTHING)
    region = models.ForeignKey('AbRegions', models.DO_NOTHING)
    country_id = models.PositiveIntegerField(blank=True, null=True)
    state_id = models.PositiveIntegerField(blank=True, null=True)
    city_id = models.PositiveIntegerField(blank=True, null=True)
    start_date = models.DateTimeField(blank=True, null=True)
    end_date = models.DateTimeField(blank=True, null=True)
    website = models.CharField(max_length=191, blank=True, null=True)
    location = models.CharField(max_length=191, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    details = models.TextField(blank=True, null=True)
    is_active = models.IntegerField()
    views = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_events'


class AbFavourites(models.Model):
    favouritable_id = models.IntegerField()
    favouritable_type = models.CharField(max_length=191)
    user_id = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_favourites'
        unique_together = (('favouritable_id', 'favouritable_type', 'user_id'),)


class AbImageGalleries(models.Model):
    title = models.CharField(max_length=191, blank=True, null=True)
    name = models.CharField(max_length=191, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_image_galleries'


class AbKeywords(models.Model):
    keywords = models.TextField()
    entity_id = models.IntegerField()
    type = models.ForeignKey('AbTypes', models.DO_NOTHING)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_keywords'


class AbLeads(models.Model):
    leadable_id = models.IntegerField()
    leadable_type = models.CharField(max_length=191)
    user = models.ForeignKey('AbUsers', models.DO_NOTHING)
    creator_id = models.IntegerField()
    lead_status = models.CharField(max_length=6)
    message = models.TextField(blank=True, null=True)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_leads'


class AbLikes(models.Model):
    likable_id = models.IntegerField()
    likable_type = models.CharField(max_length=191)
    user_id = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_likes'
        unique_together = (('likable_id', 'likable_type', 'user_id'),)


class AbManufacturers(models.Model):
    type = models.CharField(max_length=8)
    name = models.CharField(max_length=191)
    established = models.CharField(max_length=191, blank=True, null=True)
    country_id = models.PositiveIntegerField(blank=True, null=True)
    is_active = models.IntegerField()
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_manufacturers'


class AbMedias(models.Model):
    user_id = models.IntegerField(blank=True, null=True)
    accessibility = models.IntegerField()
    mediable_type = models.CharField(max_length=191)
    mediable_id = models.IntegerField()
    type = models.CharField(max_length=191, blank=True, null=True)
    path = models.CharField(max_length=191)
    original_file_name = models.CharField(max_length=191)
    meta_name = models.CharField(max_length=191, blank=True, null=True)
    is_featured = models.IntegerField()
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_medias'


class AbMigrations(models.Model):
    migration = models.CharField(max_length=191)
    batch = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'ab_migrations'


class AbModelHasPermissions(models.Model):
    permission = models.ForeignKey('AbPermissions', models.DO_NOTHING, primary_key=True)
    model_type = models.CharField(max_length=191)
    model_id = models.BigIntegerField()

    class Meta:
        managed = False
        db_table = 'ab_model_has_permissions'
        unique_together = (('permission', 'model_id', 'model_type'),)


class AbModelHasRoles(models.Model):
    role = models.ForeignKey('AbRoles', models.DO_NOTHING, primary_key=True)
    model_type = models.CharField(max_length=191)
    model_id = models.BigIntegerField()

    class Meta:
        managed = False
        db_table = 'ab_model_has_roles'
        unique_together = (('role', 'model_id', 'model_type'),)


class AbModels(models.Model):
    name = models.CharField(max_length=191)
    type = models.CharField(max_length=8)
    type_0 = models.ForeignKey('AbTypes', models.DO_NOTHING, db_column='type_id')  # Field renamed because of name conflict.
    is_active = models.IntegerField()
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_models'


class AbNews(models.Model):
    title = models.CharField(max_length=191)
    date = models.CharField(max_length=191, blank=True, null=True)
    company_id = models.PositiveIntegerField(blank=True, null=True)
    continent = models.ForeignKey(AbContinents, models.DO_NOTHING)
    region = models.ForeignKey('AbRegions', models.DO_NOTHING)
    country_id = models.PositiveIntegerField(blank=True, null=True)
    source = models.TextField(blank=True, null=True)
    details = models.TextField(blank=True, null=True)
    is_active = models.IntegerField()
    views = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_news'


class AbOffers(models.Model):
    name = models.CharField(max_length=191)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_offers'


class AbParts(models.Model):
    title = models.CharField(max_length=191)
    uid = models.CharField(max_length=191)
    user = models.ForeignKey('AbUsers', models.DO_NOTHING)
    part_number = models.CharField(max_length=191)
    alternate_part_number = models.CharField(max_length=191, blank=True, null=True)
    condition = models.ForeignKey(AbConditions, models.DO_NOTHING)
    quantity = models.FloatField()
    unit_measure = models.CharField(max_length=6, blank=True, null=True)
    price = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    release_id = models.PositiveIntegerField(blank=True, null=True)
    location = models.PositiveIntegerField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    owner = models.PositiveIntegerField(blank=True, null=True)
    seller = models.PositiveIntegerField(blank=True, null=True)
    primary_contact = models.ForeignKey(AbContacts, models.DO_NOTHING, db_column='primary_contact')
    is_active = models.IntegerField()
    is_featured = models.IntegerField()
    is_published = models.IntegerField()
    promote_status = models.IntegerField()
    views = models.IntegerField()
    likes = models.IntegerField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_parts'


class AbPasswordResets(models.Model):
    email = models.CharField(max_length=191)
    token = models.CharField(max_length=191)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_password_resets'


class AbPaymentHistories(models.Model):
    user = models.ForeignKey('AbUsers', models.DO_NOTHING)
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
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_payment_histories'


class AbPermissionUser(models.Model):
    user = models.ForeignKey('AbUsers', models.DO_NOTHING)
    permission = models.ForeignKey('AbPermissions', models.DO_NOTHING)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_permission_user'


class AbPermissions(models.Model):
    name = models.CharField(max_length=191)
    guard_name = models.CharField(max_length=191)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_permissions'


class AbPlanfeatures(models.Model):
    freaturable_type = models.CharField(max_length=191)
    freaturable_id = models.IntegerField()
    count = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_planfeatures'


class AbPlans(models.Model):
    name = models.CharField(max_length=191)
    title = models.CharField(max_length=191)
    price = models.DecimalField(max_digits=14, decimal_places=4)
    sub_title = models.CharField(max_length=191, blank=True, null=True)
    position = models.CharField(max_length=191)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    details = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_plans'


class AbPoints(models.Model):
    plan = models.ForeignKey(AbPlans, models.DO_NOTHING)
    points_type = models.CharField(max_length=8)
    number_points = models.IntegerField()
    point_text = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_points'


class AbRegions(models.Model):
    name = models.CharField(max_length=191)
    continent = models.ForeignKey(AbContinents, models.DO_NOTHING)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_regions'


class AbReleases(models.Model):
    name = models.CharField(max_length=191)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_releases'


class AbRoleHasPermissions(models.Model):
    permission = models.ForeignKey(AbPermissions, models.DO_NOTHING, primary_key=True)
    role = models.ForeignKey('AbRoles', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'ab_role_has_permissions'
        unique_together = (('permission', 'role'),)


class AbRoleUser(models.Model):
    user = models.ForeignKey('AbUsers', models.DO_NOTHING)
    role = models.ForeignKey('AbRoles', models.DO_NOTHING)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_role_user'


class AbRoles(models.Model):
    name = models.CharField(max_length=191)
    guard_name = models.CharField(max_length=191)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_roles'


class AbSeos(models.Model):
    model_id = models.IntegerField()
    model_type = models.CharField(max_length=191)
    method = models.CharField(max_length=191, blank=True, null=True)
    url = models.CharField(max_length=45, blank=True, null=True)
    title = models.CharField(max_length=191)
    description = models.TextField()
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_seos'


class AbSessions(models.Model):
    id = models.CharField(unique=True, max_length=191)
    user_id = models.PositiveIntegerField(blank=True, null=True)
    ip_address = models.CharField(max_length=45, blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    payload = models.TextField()
    last_activity = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'ab_sessions'


class AbSpecialities(models.Model):
    name = models.CharField(unique=True, max_length=191)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_specialities'


class AbStates(models.Model):
    name = models.CharField(max_length=191)
    country = models.ForeignKey(AbCountries, models.DO_NOTHING)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_states'


class AbSubscribers(models.Model):
    name = models.CharField(max_length=191)
    email = models.CharField(unique=True, max_length=191)
    comments = models.TextField(blank=True, null=True)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_subscribers'


class AbSubscriptions(models.Model):
    user_id = models.PositiveIntegerField()
    name = models.CharField(max_length=191)
    stripe_id = models.CharField(max_length=191)
    stripe_plan = models.CharField(max_length=191)
    quantity = models.IntegerField()
    trial_ends_at = models.DateTimeField(blank=True, null=True)
    ends_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_subscriptions'


class AbSuggestions(models.Model):
    user = models.ForeignKey('AbUsers', models.DO_NOTHING)
    entity_type = models.CharField(max_length=8)
    category = models.CharField(max_length=191, blank=True, null=True)
    manufacturer = models.CharField(max_length=191, blank=True, null=True)
    type = models.CharField(max_length=191, blank=True, null=True)
    model = models.CharField(max_length=191, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_suggestions'


class AbTitles(models.Model):
    name = models.CharField(max_length=191)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_titles'


class AbTypes(models.Model):
    type = models.CharField(max_length=191)
    name = models.CharField(max_length=191)
    manufacturer = models.ForeignKey(AbManufacturers, models.DO_NOTHING)
    is_active = models.IntegerField()
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_types'


class AbUsers(models.Model):
    email = models.CharField(unique=True, max_length=191)
    email_verified = models.CharField(max_length=191, blank=True, null=True)
    password = models.CharField(max_length=191)
    is_active = models.IntegerField()
    remember_token = models.CharField(max_length=100, blank=True, null=True)
    stripe_id = models.CharField(max_length=191, blank=True, null=True)
    card_brand = models.CharField(max_length=191, blank=True, null=True)
    card_last_four = models.CharField(max_length=191, blank=True, null=True)
    trial_ends_at = models.DateTimeField(blank=True, null=True)
    transaction_id = models.CharField(max_length=191, blank=True, null=True)
    order_id = models.CharField(max_length=191, blank=True, null=True)
    trans_date = models.DateTimeField(blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    new_password = models.CharField(max_length=191, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_users'


class AbViews(models.Model):
    viewable_id = models.IntegerField()
    viewable_type = models.CharField(max_length=191)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_views'


class AbWanteds(models.Model):
    title = models.CharField(max_length=191)
    uid = models.CharField(max_length=191)
    user = models.ForeignKey(AbUsers, models.DO_NOTHING)
    type = models.CharField(max_length=8)
    manufacturer_id = models.IntegerField(blank=True, null=True)
    type_id = models.IntegerField(blank=True, null=True)
    model_id = models.IntegerField(blank=True, null=True)
    part_number = models.CharField(max_length=191, blank=True, null=True)
    yom = models.CharField(max_length=191, blank=True, null=True)
    terms = models.CharField(max_length=17)
    country_id = models.IntegerField(blank=True, null=True)
    wanted_by = models.DateTimeField(blank=True, null=True)
    comments = models.TextField(blank=True, null=True)
    primary_contact = models.ForeignKey(AbContacts, models.DO_NOTHING, db_column='primary_contact')
    custom = models.TextField(blank=True, null=True)
    is_active = models.IntegerField()
    is_featured = models.IntegerField()
    is_published = models.IntegerField()
    promote_status = models.IntegerField()
    views = models.IntegerField()
    likes = models.IntegerField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_wanteds'
# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AbAccesslogs(models.Model):
    user = models.ForeignKey('AbUsers', models.DO_NOTHING)
    payload = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_accesslogs'


class AbAdditionalFields(models.Model):
    entity_id = models.PositiveIntegerField()
    entity_type = models.CharField(max_length=191)
    field_name = models.CharField(max_length=191)
    field_value = models.CharField(max_length=191)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_additional_fields'


class AbAdvertisements(models.Model):
    title = models.CharField(max_length=191)
    height = models.CharField(max_length=191, blank=True, null=True)
    width = models.CharField(max_length=191, blank=True, null=True)
    section = models.CharField(max_length=191, blank=True, null=True)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_advertisements'


class AbAircrafts(models.Model):
    title = models.CharField(max_length=191)
    uid = models.CharField(max_length=191)
    user = models.ForeignKey('AbUsers', models.DO_NOTHING)
    category = models.ForeignKey('AbCategories', models.DO_NOTHING)
    type = models.ForeignKey('AbTypes', models.DO_NOTHING)
    model_id = models.PositiveIntegerField(blank=True, null=True)
    manufacturer = models.ForeignKey('AbManufacturers', models.DO_NOTHING)
    msn = models.CharField(db_column='MSN', max_length=191)  # Field name made lowercase.
    yom = models.CharField(db_column='YOM', max_length=191)  # Field name made lowercase.
    seating_first_class = models.IntegerField(blank=True, null=True)
    seating_business = models.IntegerField(blank=True, null=True)
    seating_economy = models.IntegerField(blank=True, null=True)
    offer_for = models.CharField(max_length=14)
    mgh = models.IntegerField(blank=True, null=True)
    per_block_hour = models.FloatField(blank=True, null=True)
    cpd = models.FloatField(blank=True, null=True)
    price = models.DecimalField(max_digits=14, decimal_places=4, blank=True, null=True)
    terms = models.TextField(blank=True, null=True)
    availability = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=13)
    registration_country = models.IntegerField(blank=True, null=True)
    registration_number = models.TextField(blank=True, null=True)
    owner_id = models.IntegerField(blank=True, null=True)
    previous_operator = models.IntegerField(blank=True, null=True)
    current_operator = models.IntegerField(blank=True, null=True)
    manager_id = models.IntegerField(blank=True, null=True)
    seller_id = models.IntegerField(blank=True, null=True)
    primary_contact = models.IntegerField(blank=True, null=True)
    current_location = models.IntegerField(blank=True, null=True)
    configuration_id = models.IntegerField(blank=True, null=True)
    tsn = models.IntegerField(blank=True, null=True)
    csn = models.IntegerField(blank=True, null=True)
    mtow = models.IntegerField(blank=True, null=True)
    mlgw = models.IntegerField(blank=True, null=True)
    last_c_check = models.DateTimeField(blank=True, null=True)
    promotion_date = models.DateTimeField(blank=True, null=True)
    compliance = models.CharField(max_length=4)
    engine_type_id = models.IntegerField(blank=True, null=True)
    engine_model_id = models.IntegerField(blank=True, null=True)
    engine_manufacturer_id = models.IntegerField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    promote_status = models.IntegerField()
    views = models.IntegerField()
    likes = models.IntegerField()
    isactivestatus = models.CharField(db_column='isActiveStatus', max_length=16)  # Field name made lowercase.
    status_reason = models.TextField(blank=True, null=True)
    is_featured = models.IntegerField()
    is_active_by_user = models.IntegerField()
    is_published = models.IntegerField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_aircrafts'


class AbAirfieldTypes(models.Model):
    name = models.CharField(max_length=191)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_airfield_types'


class AbAirports(models.Model):
    name = models.CharField(max_length=191)
    user = models.ForeignKey('AbUsers', models.DO_NOTHING)
    city = models.ForeignKey('AbCities', models.DO_NOTHING)
    country = models.ForeignKey('AbCountries', models.DO_NOTHING)
    state = models.ForeignKey('AbStates', models.DO_NOTHING)
    iata_code = models.CharField(max_length=191, blank=True, null=True)
    icao_code = models.CharField(max_length=191, blank=True, null=True)
    airfield_type = models.ForeignKey(AbAirfieldTypes, models.DO_NOTHING)
    time_zone = models.CharField(max_length=191, blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    sunrise = models.CharField(max_length=191, blank=True, null=True)
    sunset = models.CharField(max_length=191, blank=True, null=True)
    views = models.IntegerField(blank=True, null=True)
    is_active = models.IntegerField()
    is_published = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_airports'


class AbAlternateparts(models.Model):
    part_number = models.CharField(max_length=191)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_alternateparts'


class AbAnalytics(models.Model):
    user = models.ForeignKey('AbUsers', models.DO_NOTHING)
    entity_id = models.PositiveIntegerField()
    type = models.ForeignKey('AbTypes', models.DO_NOTHING)
    view_count = models.IntegerField()
    search_count = models.IntegerField()
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_analytics'


class AbApus(models.Model):
    uid = models.CharField(max_length=191)
    title = models.CharField(max_length=191)
    user = models.ForeignKey('AbUsers', models.DO_NOTHING)
    category = models.ForeignKey('AbCategories', models.DO_NOTHING)
    manufacturer = models.ForeignKey('AbManufacturers', models.DO_NOTHING)
    type = models.ForeignKey('AbTypes', models.DO_NOTHING)
    model_id = models.PositiveIntegerField(blank=True, null=True)
    offer_for = models.CharField(max_length=14)
    serial_number = models.CharField(max_length=191)
    part_number = models.CharField(max_length=191, blank=True, null=True)
    status = models.CharField(max_length=11)
    availability = models.DateTimeField(blank=True, null=True)
    price = models.DecimalField(max_digits=14, decimal_places=4, blank=True, null=True)
    lease_terms = models.TextField(blank=True, null=True)
    exchange_terms = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    current_location = models.PositiveIntegerField(blank=True, null=True)
    owner_id = models.PositiveIntegerField(blank=True, null=True)
    seller_id = models.PositiveIntegerField(blank=True, null=True)
    primary_contact = models.ForeignKey('AbContacts', models.DO_NOTHING, db_column='primary_contact')
    cycle_remaining = models.CharField(max_length=191, blank=True, null=True)
    thrust_rating = models.CharField(max_length=191, blank=True, null=True)
    lsv_description = models.TextField(blank=True, null=True)
    status_reason = models.TextField(blank=True, null=True)
    promote_status = models.IntegerField()
    views = models.IntegerField()
    likes = models.IntegerField()
    promotion_date = models.DateTimeField(blank=True, null=True)
    isactivestatus = models.CharField(db_column='isActiveStatus', max_length=16)  # Field name made lowercase.
    is_featured = models.IntegerField()
    is_active_by_user = models.IntegerField()
    is_published = models.IntegerField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_apus'


class AbAttaches(models.Model):
    user_id = models.IntegerField(blank=True, null=True)
    accessibility = models.IntegerField()
    attachable_type = models.CharField(max_length=191)
    attachable_id = models.IntegerField()
    type = models.CharField(max_length=191, blank=True, null=True)
    path = models.CharField(max_length=191)
    original_file_name = models.CharField(max_length=191)
    is_featured = models.IntegerField()
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_attaches'


class AbAttachments(models.Model):
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_attachments'


class AbCannedemails(models.Model):
    message_type = models.CharField(max_length=191)
    subject = models.CharField(max_length=191)
    sending_email = models.CharField(max_length=191)
    message = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=191)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_cannedemails'


class AbCategories(models.Model):
    type = models.CharField(max_length=8)
    name = models.CharField(max_length=191)
    description = models.TextField(blank=True, null=True)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_categories'
        unique_together = (('type', 'name'),)


class AbCategoryEvent(models.Model):
    event = models.ForeignKey('AbEvents', models.DO_NOTHING)
    category = models.ForeignKey(AbCategories, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'ab_category_event'


class AbCategoryManufacturer(models.Model):
    manufacturer = models.ForeignKey('AbManufacturers', models.DO_NOTHING)
    category = models.ForeignKey(AbCategories, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'ab_category_manufacturer'


class AbCategoryNews(models.Model):
    news = models.ForeignKey('AbNews', models.DO_NOTHING)
    category = models.ForeignKey(AbCategories, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'ab_category_news'


class AbCities(models.Model):
    name = models.CharField(max_length=191)
    state = models.ForeignKey('AbStates', models.DO_NOTHING)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_cities'


class AbCms(models.Model):
    url = models.CharField(max_length=191)
    section = models.CharField(max_length=191)
    title = models.CharField(max_length=191, blank=True, null=True)
    sub_title = models.CharField(max_length=191, blank=True, null=True)
    custom_url = models.CharField(max_length=191, blank=True, null=True)
    body = models.TextField(blank=True, null=True)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_cms'


class AbCompanies(models.Model):
    name = models.CharField(max_length=191)
    status = models.IntegerField()
    profile = models.TextField(blank=True, null=True)
    zip_code = models.CharField(max_length=191, blank=True, null=True)
    po_box = models.CharField(max_length=191, blank=True, null=True)
    business_phone = models.CharField(max_length=191, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    city_id = models.PositiveIntegerField(blank=True, null=True)
    state_id = models.PositiveIntegerField(blank=True, null=True)
    country_id = models.PositiveIntegerField(blank=True, null=True)
    logo = models.TextField(blank=True, null=True)
    website = models.TextField(blank=True, null=True)
    is_active = models.IntegerField()
    is_published = models.IntegerField()
    views = models.IntegerField()
    rfq_email = models.CharField(max_length=191, blank=True, null=True)
    aog_email = models.CharField(max_length=191, blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_companies'


class AbCompanySpeciality(models.Model):
    company = models.ForeignKey(AbCompanies, models.DO_NOTHING)
    speciality = models.ForeignKey('AbSpecialities', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'ab_company_speciality'


class AbConditions(models.Model):
    name = models.CharField(max_length=191)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_conditions'


class AbConfigurations(models.Model):
    name = models.CharField(max_length=191)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_configurations'


class AbConnections(models.Model):
    user = models.ForeignKey('AbUsers', models.DO_NOTHING)
    conected_user = models.ForeignKey('AbUsers', models.DO_NOTHING)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_connections'


class AbContactQueries(models.Model):
    name = models.CharField(max_length=191)
    email = models.CharField(max_length=191)
    phone = models.CharField(max_length=191)
    country = models.ForeignKey('AbCountries', models.DO_NOTHING)
    message = models.TextField()
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_contact_queries'


class AbContacts(models.Model):
    creator = models.ForeignKey('AbUsers', models.DO_NOTHING)
    email = models.CharField(max_length=191)
    title = models.CharField(max_length=7)
    company_id = models.PositiveIntegerField(blank=True, null=True)
    user_id = models.PositiveIntegerField(blank=True, null=True)
    first_name = models.CharField(max_length=191)
    last_name = models.CharField(max_length=191)
    gender = models.CharField(max_length=6)
    birthday = models.CharField(max_length=191, blank=True, null=True)
    job_title = models.PositiveIntegerField(blank=True, null=True)
    department_id = models.PositiveIntegerField(blank=True, null=True)
    business_phone = models.CharField(max_length=191, blank=True, null=True)
    mobile_phone = models.CharField(max_length=191, blank=True, null=True)
    skype = models.CharField(max_length=191, blank=True, null=True)
    linkedin = models.CharField(max_length=191, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    city_id = models.PositiveIntegerField(blank=True, null=True)
    country_id = models.PositiveIntegerField(blank=True, null=True)
    state_id = models.PositiveIntegerField(blank=True, null=True)
    religion = models.CharField(max_length=191, blank=True, null=True)
    preferred_contact_method = models.CharField(max_length=5, blank=True, null=True)
    message = models.TextField(blank=True, null=True)
    contact_date = models.DateTimeField(blank=True, null=True)
    is_published = models.IntegerField()
    is_primary = models.IntegerField()
    is_public = models.IntegerField()
    views = models.IntegerField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_contacts'


class AbContents(models.Model):
    user = models.ForeignKey('AbUsers', models.DO_NOTHING)
    path = models.CharField(max_length=191)
    title = models.CharField(max_length=191, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_contents'


class AbContinents(models.Model):
    name = models.CharField(max_length=191)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_continents'


class AbCountries(models.Model):
    name = models.CharField(max_length=191)
    continent = models.ForeignKey(AbContinents, models.DO_NOTHING)
    region = models.ForeignKey('AbRegions', models.DO_NOTHING)
    capital = models.CharField(max_length=191, blank=True, null=True)
    currency = models.CharField(max_length=191, blank=True, null=True)
    iso_3116_alpha_2 = models.CharField(max_length=191, blank=True, null=True)
    dialing_code = models.CharField(max_length=191, blank=True, null=True)
    flag = models.TextField(blank=True, null=True)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_countries'


class AbDepartments(models.Model):
    name = models.CharField(max_length=191)
    type = models.CharField(max_length=191)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_departments'


class AbEngines(models.Model):
    uid = models.CharField(max_length=191)
    title = models.CharField(max_length=191, blank=True, null=True)
    user = models.ForeignKey('AbUsers', models.DO_NOTHING)
    manufacturer = models.ForeignKey('AbManufacturers', models.DO_NOTHING)
    category = models.ForeignKey(AbCategories, models.DO_NOTHING)
    type = models.ForeignKey('AbTypes', models.DO_NOTHING)
    model_id = models.PositiveIntegerField(blank=True, null=True)
    offer_for = models.CharField(max_length=14)
    esn = models.CharField(max_length=191, blank=True, null=True)
    status = models.CharField(max_length=15)
    availability = models.DateTimeField(blank=True, null=True)
    price = models.DecimalField(max_digits=14, decimal_places=4, blank=True, null=True)
    lease_terms = models.TextField(blank=True, null=True)
    exchange_terms = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    current_location = models.ForeignKey(AbCountries, models.DO_NOTHING, db_column='current_location')
    owner_id = models.PositiveIntegerField(blank=True, null=True)
    seller_id = models.PositiveIntegerField(blank=True, null=True)
    primary_contact = models.ForeignKey(AbContacts, models.DO_NOTHING, db_column='primary_contact')
    cycle_remaining = models.IntegerField()
    thrust_rating = models.CharField(max_length=191, blank=True, null=True)
    lsv_description = models.TextField(blank=True, null=True)
    tso = models.TextField(blank=True, null=True)
    status_reason = models.TextField(blank=True, null=True)
    promotion_date = models.DateTimeField(blank=True, null=True)
    views = models.IntegerField()
    likes = models.IntegerField()
    isactivestatus = models.CharField(db_column='isActiveStatus', max_length=16)  # Field name made lowercase.
    is_featured = models.IntegerField()
    is_active_by_user = models.IntegerField()
    is_published = models.IntegerField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_engines'


class AbEvents(models.Model):
    title = models.CharField(max_length=191)
    continent = models.ForeignKey(AbContinents, models.DO_NOTHING)
    region = models.ForeignKey('AbRegions', models.DO_NOTHING)
    country_id = models.PositiveIntegerField(blank=True, null=True)
    state_id = models.PositiveIntegerField(blank=True, null=True)
    city_id = models.PositiveIntegerField(blank=True, null=True)
    start_date = models.DateTimeField(blank=True, null=True)
    end_date = models.DateTimeField(blank=True, null=True)
    website = models.CharField(max_length=191, blank=True, null=True)
    location = models.CharField(max_length=191, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    details = models.TextField(blank=True, null=True)
    is_active = models.IntegerField()
    views = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_events'


class AbFavourites(models.Model):
    favouritable_id = models.IntegerField()
    favouritable_type = models.CharField(max_length=191)
    user_id = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_favourites'
        unique_together = (('favouritable_id', 'favouritable_type', 'user_id'),)


class AbImageGalleries(models.Model):
    title = models.CharField(max_length=191, blank=True, null=True)
    name = models.CharField(max_length=191, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_image_galleries'


class AbKeywords(models.Model):
    keywords = models.TextField()
    entity_id = models.IntegerField()
    type = models.ForeignKey('AbTypes', models.DO_NOTHING)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_keywords'


class AbLeads(models.Model):
    leadable_id = models.IntegerField()
    leadable_type = models.CharField(max_length=191)
    user = models.ForeignKey('AbUsers', models.DO_NOTHING)
    creator_id = models.IntegerField()
    lead_status = models.CharField(max_length=6)
    message = models.TextField(blank=True, null=True)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_leads'


class AbLikes(models.Model):
    likable_id = models.IntegerField()
    likable_type = models.CharField(max_length=191)
    user_id = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_likes'
        unique_together = (('likable_id', 'likable_type', 'user_id'),)


class AbManufacturers(models.Model):
    type = models.CharField(max_length=8)
    name = models.CharField(max_length=191)
    established = models.CharField(max_length=191, blank=True, null=True)
    country_id = models.PositiveIntegerField(blank=True, null=True)
    is_active = models.IntegerField()
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_manufacturers'
        unique_together = (('type', 'name'),)


class AbMedias(models.Model):
    user_id = models.IntegerField(blank=True, null=True)
    accessibility = models.IntegerField()
    mediable_type = models.CharField(max_length=191)
    mediable_id = models.IntegerField()
    type = models.CharField(max_length=191, blank=True, null=True)
    path = models.CharField(max_length=191)
    original_file_name = models.CharField(max_length=191)
    meta_name = models.CharField(max_length=191, blank=True, null=True)
    is_featured = models.IntegerField()
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_medias'


class AbMigrations(models.Model):
    migration = models.CharField(max_length=191)
    batch = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'ab_migrations'


class AbModelHasPermissions(models.Model):
    permission = models.ForeignKey('AbPermissions', models.DO_NOTHING, primary_key=True)
    model_type = models.CharField(max_length=191)
    model_id = models.BigIntegerField()

    class Meta:
        managed = False
        db_table = 'ab_model_has_permissions'
        unique_together = (('permission', 'model_id', 'model_type'),)


class AbModelHasRoles(models.Model):
    role = models.ForeignKey('AbRoles', models.DO_NOTHING, primary_key=True)
    model_type = models.CharField(max_length=191)
    model_id = models.BigIntegerField()

    class Meta:
        managed = False
        db_table = 'ab_model_has_roles'
        unique_together = (('role', 'model_id', 'model_type'),)


class AbModels(models.Model):
    name = models.CharField(max_length=191)
    type = models.CharField(max_length=8)
    type_0 = models.ForeignKey('AbTypes', models.DO_NOTHING, db_column='type_id')  # Field renamed because of name conflict.
    is_active = models.IntegerField()
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_models'
        unique_together = (('type', 'name'),)


class AbNews(models.Model):
    title = models.CharField(max_length=191)
    date = models.CharField(max_length=191, blank=True, null=True)
    company_id = models.PositiveIntegerField(blank=True, null=True)
    continent = models.ForeignKey(AbContinents, models.DO_NOTHING)
    region = models.ForeignKey('AbRegions', models.DO_NOTHING)
    country_id = models.PositiveIntegerField(blank=True, null=True)
    source = models.TextField(blank=True, null=True)
    details = models.TextField(blank=True, null=True)
    is_active = models.IntegerField()
    views = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_news'


class AbOffers(models.Model):
    name = models.CharField(max_length=191)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_offers'


class AbParts(models.Model):
    title = models.CharField(max_length=191)
    uid = models.CharField(max_length=191)
    user = models.ForeignKey('AbUsers', models.DO_NOTHING)
    part_number = models.CharField(max_length=191)
    alternate_part_number = models.CharField(max_length=191, blank=True, null=True)
    condition = models.ForeignKey(AbConditions, models.DO_NOTHING)
    quantity = models.FloatField()
    unit_measure = models.CharField(max_length=6)
    price = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    release_id = models.PositiveIntegerField(blank=True, null=True)
    location = models.PositiveIntegerField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    owner = models.PositiveIntegerField(blank=True, null=True)
    seller = models.PositiveIntegerField(blank=True, null=True)
    primary_contact = models.ForeignKey(AbContacts, models.DO_NOTHING, db_column='primary_contact')
    is_active = models.IntegerField()
    is_featured = models.IntegerField()
    is_published = models.IntegerField()
    promote_status = models.IntegerField()
    views = models.IntegerField()
    likes = models.IntegerField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_parts'


class AbPasswordResets(models.Model):
    email = models.CharField(max_length=191)
    token = models.CharField(max_length=191)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_password_resets'


class AbPaymentHistories(models.Model):
    user = models.ForeignKey('AbUsers', models.DO_NOTHING)
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
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_payment_histories'


class AbPermissionUser(models.Model):
    user = models.ForeignKey('AbUsers', models.DO_NOTHING)
    permission = models.ForeignKey('AbPermissions', models.DO_NOTHING)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_permission_user'


class AbPermissions(models.Model):
    name = models.CharField(max_length=191)
    guard_name = models.CharField(max_length=191)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_permissions'


class AbPlanfeatures(models.Model):
    freaturable_type = models.CharField(max_length=191)
    freaturable_id = models.IntegerField()
    count = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_planfeatures'


class AbPlans(models.Model):
    name = models.CharField(max_length=191)
    title = models.CharField(max_length=191)
    price = models.DecimalField(max_digits=14, decimal_places=4)
    sub_title = models.CharField(max_length=191, blank=True, null=True)
    position = models.CharField(max_length=191)
    is_active = models.IntegerField()
    details = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_plans'


class AbPoints(models.Model):
    plan = models.ForeignKey(AbPlans, models.DO_NOTHING)
    points_type = models.CharField(max_length=8)
    number_points = models.IntegerField()
    point_text = models.TextField(blank=True, null=True)
    sub_text = models.CharField(max_length=200, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_points'


class AbRegions(models.Model):
    name = models.CharField(max_length=191)
    continent = models.ForeignKey(AbContinents, models.DO_NOTHING)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_regions'


class AbReleases(models.Model):
    name = models.CharField(max_length=191)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_releases'


class AbRoleHasPermissions(models.Model):
    permission = models.ForeignKey(AbPermissions, models.DO_NOTHING, primary_key=True)
    role = models.ForeignKey('AbRoles', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'ab_role_has_permissions'
        unique_together = (('permission', 'role'),)


class AbRoleUser(models.Model):
    user = models.ForeignKey('AbUsers', models.DO_NOTHING)
    role = models.ForeignKey('AbRoles', models.DO_NOTHING)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_role_user'


class AbRoles(models.Model):
    name = models.CharField(max_length=191)
    guard_name = models.CharField(max_length=191)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_roles'


class AbSeos(models.Model):
    model_id = models.IntegerField()
    model_type = models.CharField(max_length=191)
    method = models.CharField(max_length=191, blank=True, null=True)
    title = models.CharField(max_length=191)
    description = models.TextField()
    is_active = models.IntegerField()
    url = models.CharField(max_length=200)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_seos'


class AbSessions(models.Model):
    id = models.CharField(unique=True, max_length=191)
    user_id = models.PositiveIntegerField(blank=True, null=True)
    ip_address = models.CharField(max_length=45, blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    payload = models.TextField()
    last_activity = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'ab_sessions'


class AbSpecialities(models.Model):
    name = models.CharField(unique=True, max_length=191)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_specialities'


class AbStates(models.Model):
    name = models.CharField(max_length=191)
    country = models.ForeignKey(AbCountries, models.DO_NOTHING)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_states'


class AbSubscribers(models.Model):
    name = models.CharField(max_length=191)
    email = models.CharField(unique=True, max_length=191)
    comments = models.TextField(blank=True, null=True)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_subscribers'


class AbSubscriptions(models.Model):
    user_id = models.PositiveIntegerField()
    name = models.CharField(max_length=191)
    stripe_id = models.CharField(max_length=191)
    stripe_plan = models.CharField(max_length=191)
    quantity = models.IntegerField()
    trial_ends_at = models.DateTimeField(blank=True, null=True)
    ends_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_subscriptions'


class AbSuggestions(models.Model):
    user = models.ForeignKey('AbUsers', models.DO_NOTHING)
    entity_type = models.CharField(max_length=8)
    category = models.CharField(max_length=191, blank=True, null=True)
    manufacturer = models.CharField(max_length=191, blank=True, null=True)
    type = models.CharField(max_length=191, blank=True, null=True)
    model = models.CharField(max_length=191, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_suggestions'


class AbTitles(models.Model):
    name = models.CharField(max_length=191)
    is_active = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_titles'


class AbTypes(models.Model):
    type = models.CharField(max_length=191)
    name = models.CharField(max_length=191)
    manufacturer = models.ForeignKey(AbManufacturers, models.DO_NOTHING)
    is_active = models.IntegerField()
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_types'


class AbUsers(models.Model):
    email = models.CharField(unique=True, max_length=191)
    email_verified = models.CharField(max_length=191, blank=True, null=True)
    password = models.CharField(max_length=191)
    is_active = models.IntegerField()
    remember_token = models.CharField(max_length=100, blank=True, null=True)
    stripe_id = models.CharField(max_length=191, blank=True, null=True)
    card_brand = models.CharField(max_length=191, blank=True, null=True)
    card_last_four = models.CharField(max_length=191, blank=True, null=True)
    trial_ends_at = models.DateTimeField(blank=True, null=True)
    transaction_id = models.CharField(max_length=191, blank=True, null=True)
    order_id = models.CharField(max_length=191, blank=True, null=True)
    trans_date = models.DateTimeField(blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    new_password = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'ab_users'


class AbViews(models.Model):
    viewable_id = models.IntegerField()
    viewable_type = models.CharField(max_length=191)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_views'


class AbWanteds(models.Model):
    title = models.CharField(max_length=191)
    uid = models.CharField(max_length=191)
    user = models.ForeignKey(AbUsers, models.DO_NOTHING)
    type = models.CharField(max_length=8)
    manufacturer_id = models.IntegerField(blank=True, null=True)
    type_id = models.IntegerField(blank=True, null=True)
    model_id = models.IntegerField(blank=True, null=True)
    part_number = models.CharField(max_length=191, blank=True, null=True)
    yom = models.CharField(max_length=191, blank=True, null=True)
    terms = models.CharField(max_length=17)
    country_id = models.IntegerField(blank=True, null=True)
    wanted_by = models.DateTimeField(blank=True, null=True)
    comments = models.TextField(blank=True, null=True)
    primary_contact = models.ForeignKey(AbContacts, models.DO_NOTHING, db_column='primary_contact')
    custom = models.TextField(blank=True, null=True)
    is_active = models.IntegerField()
    is_featured = models.IntegerField()
    is_published = models.IntegerField()
    promote_status = models.IntegerField()
    views = models.IntegerField()
    likes = models.IntegerField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ab_wanteds'
