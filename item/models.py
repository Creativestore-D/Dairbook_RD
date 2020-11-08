from django.db import models
# from auditlog.registry import auditlog

# Create your models here.

class AbAircrafts(models.Model):
    title = models.CharField(max_length=191, blank=True)
    uid = models.CharField(max_length=191, blank=True)
    user = models.ForeignKey('account.AbUsers', models.DO_NOTHING)
    category = models.ForeignKey('info.AbCategories', models.DO_NOTHING)
    type = models.ForeignKey('account.AbTypes', models.DO_NOTHING)
    model = models.ForeignKey('account.AbModels', models.DO_NOTHING, blank=True, null=True)
    manufacturer = models.ForeignKey('account.AbManufacturers', models.DO_NOTHING)
    msn = models.CharField(db_column='MSN', max_length=191, blank=True, null=True)  # Field name made lowercase.
    yom = models.CharField(db_column='YOM', max_length=191)  # Field name made lowercase.
    seating_first_class = models.IntegerField(blank=True, null=True)
    seating_business = models.IntegerField(blank=True, null=True)
    seating_economy = models.IntegerField(blank=True, null=True)
    OFFER_FOR_CHOICES = (
        ('Sale', 'Sale'),
        ('ACMI', 'ACMI'),
        ('Dry Lease', 'Dry Lease'),
        ('Wet Lease', 'Wet Lease'),
        ('Exchange', 'Exchange'),
        ('Charter', 'Charter'),
        ('Lease Purchase', 'Lease Purchase'),
    )
    offer_for = models.CharField(choices=OFFER_FOR_CHOICES, max_length=14)
    mgh = models.IntegerField(blank=True, null=True)
    per_block_hour = models.FloatField(blank=True, null=True)
    cpd = models.FloatField(blank=True, null=True)
    price = models.DecimalField(max_digits=14, decimal_places=4, blank=True, null=True)
    terms = models.TextField(blank=True, null=True)
    availability = models.DateTimeField(blank=True, null=True)
    STATUS_CHOICES = (
        ('Storage', 'Storage'),
        ('Parking', 'Parking'),
        ('Operational', 'Operational'),
        ('For Tear Down', 'For Tear Down'),
    )
    status = models.CharField(choices=STATUS_CHOICES, max_length=13, blank=True)
    registration_country = models.ForeignKey('connect.AbCountries', models.DO_NOTHING, db_column="registration_country", related_name="registration_country_aircraft", blank=True, null=True)
    registration_number = models.TextField(blank=True, null=True)
    owner = models.ForeignKey('connect.AbCompanies', models.DO_NOTHING, blank=True, null=True)
    previous_operator = models.ForeignKey('connect.AbCompanies', models.DO_NOTHING, db_column="previous_operator", related_name="previous_operator_aircraft", blank=True, null=True)
    current_operator = models.ForeignKey('connect.AbCompanies', models.DO_NOTHING, db_column="current_operator", related_name="current_operator_aircraft", blank=True, null=True)
    manager = models.ForeignKey('connect.AbCompanies', models.DO_NOTHING, related_name="manager_aircraft", blank=True, null=True)
    seller = models.ForeignKey('connect.AbCompanies', models.DO_NOTHING, related_name="seller_aircraft", blank=True, null=True)
    primary_contact = models.ForeignKey('connect.AbContacts', models.DO_NOTHING, db_column="primary_contact", blank=True, null=True)
    current_location = models.ForeignKey('connect.AbCountries', models.DO_NOTHING, db_column="current_location",  blank=True, null=True)
    configuration= models.ForeignKey('info.AbConfigurations', models.DO_NOTHING,  blank=True, null=True)
    tsn = models.IntegerField(blank=True, null=True)
    csn = models.IntegerField(blank=True, null=True)
    mtow = models.IntegerField(blank=True, null=True)
    mlgw = models.IntegerField(blank=True, null=True)
    last_c_check = models.DateTimeField(blank=True, null=True)
    promotion_date = models.DateTimeField(blank=True, null=True)
    COMPLIANCE_CHOICES = (
        ('EASA', 'EASA'),
        ('FAA', 'FAA'),
        ('TBA', 'TBA'),
    )
    compliance = models.CharField(choices=COMPLIANCE_CHOICES, max_length=4, blank=True)
    engine_type = models.ForeignKey('account.AbTypes', models.DO_NOTHING, related_name="engine_type_aircraft", blank=True, null=True)
    engine_model = models.ForeignKey('account.AbModels', models.DO_NOTHING, related_name="engine_model_aircraft", blank=True, null=True)
    engine_manufacturer = models.ForeignKey('account.AbManufacturers', models.DO_NOTHING, related_name="engine_manufacturer_aircraft", blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    promote_status = models.IntegerField(default=False)
    views = models.IntegerField(default=False)
    likes = models.IntegerField(default=False)
    ISACTIVESTATUS_CHOICES = (
        ('Pending Approval', 'Pending Approval'),
        ('Approved', 'Approved'),
        ('Revise', 'Revise'),
        ('Rejected', 'Rejected'),
        ('Expired', 'Expired'),
    )
    isactivestatus = models.CharField(choices=ISACTIVESTATUS_CHOICES,db_column='isActiveStatus', max_length=16, blank=True)
    status_reason = models.TextField(blank=True, null=True)
    is_featured = models.IntegerField(default=False)
    is_active_by_user = models.IntegerField(default=False)
    is_published = models.IntegerField(default=False)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_aircrafts'
        ordering = ['-updated_at']

class AbApus(models.Model):
    uid = models.CharField(max_length=191, blank=True)
    title = models.CharField(max_length=191, blank=True)
    user = models.ForeignKey('account.AbUsers', models.DO_NOTHING)
    category = models.ForeignKey('info.AbCategories', models.DO_NOTHING)
    manufacturer = models.ForeignKey('account.AbManufacturers', models.DO_NOTHING)
    type = models.ForeignKey('account.AbTypes', models.DO_NOTHING)
    model = models.ForeignKey('account.AbModels', models.DO_NOTHING, blank=True, null=True)
    OFFER_FOR_CHOICES = (
        ('Sale', 'Sale'),
        ('Lease', 'Lease'),
        ('Exchange', 'Exchange'),
        ('Lease Purchase', 'Lease Purchase'),
    )
    offer_for = models.CharField(choices=OFFER_FOR_CHOICES, max_length=14)
    serial_number = models.CharField(max_length=191)
    part_number = models.CharField(max_length=191, blank=True, null=True)
    STATUS_CHOICES = (
        ('new','new'),
        ('as removed','as removed'),
        ('overhauled', 'overhauled'),
        ('serviceable', 'serviceable'),
        ('repaired', 'repaired'),
        ('operational', 'operational'),
        ('storage', 'storage'),
        ('non serviceable', 'non serviceable'),
        ('tear down', 'tear down'),
        
    )
    status = models.CharField(choices=STATUS_CHOICES, max_length=20, blank=True)
    availability = models.DateTimeField(blank=True, null=True)
    price = models.DecimalField(max_digits=14, decimal_places=4, blank=True, null=True)
    lease_terms = models.TextField(blank=True, null=True)
    exchange_terms = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    current_location = models.ForeignKey('connect.AbCountries', models.DO_NOTHING, db_column="current_location",  blank=True, null=True)
    owner = models.ForeignKey('connect.AbCompanies', models.DO_NOTHING, blank=True, null=True)
    seller = models.ForeignKey('connect.AbCompanies', models.DO_NOTHING, related_name="seller_apu", blank=True,null=True)
    primary_contact = models.ForeignKey('connect.AbContacts', models.DO_NOTHING, db_column='primary_contact')
    cycle_remaining = models.CharField(max_length=191, blank=True, null=True)
    thrust_rating = models.CharField(max_length=191, blank=True, null=True)
    lsv_description = models.TextField(blank=True, null=True)
    status_reason = models.TextField(blank=True, null=True)
    promote_status = models.IntegerField(default=False)
    views = models.IntegerField(default=False)
    likes = models.IntegerField(default=False)
    promotion_date = models.DateTimeField(blank=True, null=True)
    ISACTIVESTATUS_CHOICES = (
        ('Pending Approval', 'Pending Approval'),
        ('Approved', 'Approved'),
        ('Revise', 'Revise'),
        ('Rejected', 'Rejected'),
    )
    isactivestatus = models.CharField(choices=ISACTIVESTATUS_CHOICES, db_column='isActiveStatus', max_length=16,blank=True, default='Pending Approval')# Field name made lowercase.
    is_featured = models.IntegerField(default=False)
    is_active_by_user = models.IntegerField(default=False)
    is_published = models.IntegerField(default=False)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_apus'
        ordering = ['-updated_at']

class AbAirfieldTypes(models.Model):
    name = models.CharField(max_length=191)
    is_active = models.IntegerField(default=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_airfield_types'
        ordering = ['-updated_at']

class AbAirports(models.Model):
    name = models.CharField(max_length=191)
    user = models.ForeignKey('account.AbUsers', models.DO_NOTHING, blank=True, null=True)
    city = models.ForeignKey('connect.AbCities', models.DO_NOTHING, blank=True, null=True)
    country = models.ForeignKey('connect.AbCountries', models.DO_NOTHING)
    state = models.ForeignKey('connect.AbStates', models.DO_NOTHING, blank=True, null=True)
    iata_code = models.CharField(max_length=191, blank=True, null=True)
    icao_code = models.CharField(max_length=191, blank=True, null=True)
    airfield_type = models.ForeignKey(AbAirfieldTypes, models.DO_NOTHING)
    time_zone = models.CharField(max_length=191, blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    sunrise = models.CharField(max_length=191, blank=True, null=True)
    sunset = models.CharField(max_length=191, blank=True, null=True)
    views = models.IntegerField(default=False)
    elevation = models.FloatField(blank=True, null=True)
    gps_code = models.FloatField(blank=True, null=True)
    iso_country = models.CharField(max_length=191, blank=True, null=True)
    is_active = models.IntegerField(default=True)
    is_published = models.IntegerField(default=False)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_airports'
        ordering = ['-updated_at']

class AbEngines(models.Model):
    uid = models.CharField(max_length=191, blank=True)
    title = models.CharField(max_length=191, blank=True, null=True)
    user = models.ForeignKey('account.AbUsers', models.DO_NOTHING)
    manufacturer = models.ForeignKey('account.AbManufacturers', models.DO_NOTHING )
    category = models.ForeignKey('info.AbCategories', models.DO_NOTHING)
    type = models.ForeignKey('account.AbTypes', models.DO_NOTHING)
    model = models.ForeignKey('account.AbModels',models.DO_NOTHING, blank=True, null=True)
    OFFER_FOR_CHOICES = (
        ('Sale', 'Sale'),
        ('Lease', 'Lease'),
        ('Exchange', 'Exchange'),
        ('Lease Purchase', 'Lease Purchase'),
    )
    offer_for = models.CharField(choices=OFFER_FOR_CHOICES, max_length=14)
    esn = models.CharField(max_length=191, blank=True, null=True)
    STATUS_CHOICES = (
        ('new', 'new'),
        ('as removed', 'as removed'),
        ('overhauled', 'overhauled'),
        ('serviceable', 'serviceable'),
        ('repaired', 'repaired'),
        ('operational', 'operational'),
        ('storage', 'storage'),
        ('non serviceable', 'non serviceable'),
        ('tear down', 'tear down'),
    )
    status = models.CharField(choices=STATUS_CHOICES, max_length=15, default='new')
    availability = models.DateTimeField(blank=True, null=True)
    price = models.DecimalField(max_digits=14, decimal_places=4, blank=True, null=True)
    lease_terms = models.TextField(blank=True, null=True)
    exchange_terms = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    current_location = models.ForeignKey('connect.AbCountries', models.DO_NOTHING, db_column='current_location')
    owner = models.ForeignKey('connect.AbCompanies', models.DO_NOTHING, related_name="owner_engines", blank=True, null=True)
    seller = models.ForeignKey('connect.AbCompanies', models.DO_NOTHING, related_name="seller_engines", blank=True, null=True)
    primary_contact = models.ForeignKey('connect.AbContacts', models.DO_NOTHING, db_column='primary_contact')
    cycle_remaining = models.IntegerField(default=False)
    thrust_rating = models.CharField(max_length=191, blank=True, null=True)
    lsv_description = models.TextField(blank=True, null=True)
    tso = models.TextField(blank=True, null=True)
    status_reason = models.TextField(blank=True, null=True)
    promotion_date = models.DateTimeField(blank=True, null=True)
    views = models.IntegerField(default=False)
    likes = models.IntegerField(default=False)
    ISACTIVESTATUS_CHOICES = (
        ('Pending Approval', 'Pending Approval'),
        ('Approved', 'Approved'),
        ('Revise', 'Revise'),
        ('Rejected', 'Rejected'),
    )
    isactivestatus = models.CharField(choices=ISACTIVESTATUS_CHOICES, db_column='isActiveStatus', max_length=16, default='Pending Approval')  # Field name made lowercase.
    is_featured = models.IntegerField(default=False)
    is_active_by_user = models.IntegerField(default=False)
    is_published = models.IntegerField(default=False)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_engines'
        ordering = ['-updated_at']

class AbEvents(models.Model):
    title = models.CharField(max_length=191)
    continent = models.ForeignKey('connect.AbContinents', models.DO_NOTHING)
    region = models.ForeignKey('connect.AbRegions', models.DO_NOTHING)
    categories = models.ManyToManyField('info.AbCategories', related_name='event', through='AbCategoryEvent')
    country = models.ForeignKey('connect.AbCountries', models.DO_NOTHING, blank=True, null=True)
    state = models.ForeignKey('connect.AbStates', models.DO_NOTHING,blank=True, null=True)
    city = models.ForeignKey('connect.AbCities', models.DO_NOTHING,blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    website = models.CharField(max_length=191, blank=True, null=True)
    location = models.CharField(max_length=191, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    details = models.TextField(blank=True, null=True)
    is_active = models.IntegerField()
    views = models.IntegerField(default=False)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_events'
        ordering = ['-updated_at']

class AbCategoryEvent(models.Model):
    event = models.ForeignKey('AbEvents', models.CASCADE)
    category = models.ForeignKey('info.AbCategories', models.CASCADE)

    class Meta:
        managed = True
        db_table = 'ab_category_event'

class AbConditions(models.Model):
    name = models.CharField(max_length=191)
    is_active = models.IntegerField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_conditions'
        ordering = ['-updated_at']

class AbParts(models.Model):
    title = models.CharField(max_length=191, blank=True)
    uid = models.CharField(max_length=191, blank=True)
    user = models.ForeignKey('account.AbUsers', models.DO_NOTHING)
    part_number = models.CharField(max_length=191)
    alternate_part_number = models.CharField(max_length=191, blank=True, null=True)
    condition = models.ForeignKey(AbConditions, models.DO_NOTHING)
    quantity = models.FloatField()
    UNIT_MEASURE_CHOICES = (
        ('Values', 'Values'),
        ('TBA', 'TBA'),
        ('EA', 'EA'),
        ('KG', 'KG'),
        ('LBS', 'LBS'),
        ('MM', 'MM'),
        ('CM', 'CM'),
        ('inch', 'inch'),
        ('foot', 'foot'),
        ('liter', 'liter'),
        ('gallon', 'gallon'),
    )
    unit_measure = models.CharField(choices=UNIT_MEASURE_CHOICES, max_length=6, blank=True, null=True)
    price = models.DecimalField(max_digits=16, decimal_places=4, blank=True, null=True)
    release = models.ForeignKey('info.AbReleases', models.DO_NOTHING,blank=True, null=True)
    location = models.ForeignKey('connect.AbCountries', models.DO_NOTHING,blank=True, null=True, db_column='location')
    description = models.TextField(blank=True, null=True)
    owner = models.ForeignKey('connect.AbCompanies', models.DO_NOTHING,related_name="owner_parts", blank=True, null=True, db_column='owner')
    seller = models.ForeignKey('connect.AbCompanies', models.DO_NOTHING,related_name="seller_parts", blank=True, null=True, db_column='seller')
    primary_contact = models.ForeignKey('connect.AbContacts', models.DO_NOTHING, db_column='primary_contact')
    is_active = models.IntegerField(default=False)
    is_featured = models.IntegerField(default=False)
    is_published = models.IntegerField(default=False)
    promote_status = models.IntegerField(default=False)
    views = models.IntegerField(default=False)
    likes = models.IntegerField(default=False)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_parts'
        ordering = ['-updated_at']

class AbAlternateparts(models.Model):
    part_number = models.CharField(max_length=191)
    is_active = models.IntegerField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_alternateparts'
        ordering = ['-updated_at']

class AbWanteds(models.Model):
    title = models.CharField(max_length=191, blank=True)
    uid = models.CharField(max_length=191, blank=True)
    user = models.ForeignKey('account.AbUsers', models.DO_NOTHING)
    manufacturer = models.ForeignKey('account.AbManufacturers', models.DO_NOTHING , blank=True, null=True)
    TYPE_CHOICES = (
        ('aircraft', 'Aircraft'),
        ('engine', 'Engine'),
        ('apu', 'APU'),
        ('parts', 'Parts'),
    )
    type = models.CharField(choices=TYPE_CHOICES, max_length=8)
    type_0 = models.ForeignKey('account.AbTypes', models.DO_NOTHING,blank=True, null=True, db_column='type_id')
    model = models.ForeignKey('account.AbModels', models.DO_NOTHING, blank=True, null=True)
    part_number = models.CharField(max_length=191, blank=True, null=True)
    yom = models.CharField(max_length=191, blank=True, null=True)
    TERMS_CHOICES = (
        ('ACMI', 'ACMI'),
        ('Dry Lease', 'Dry Lease'),
        ('Charter', 'Charter'),
        ('Lease Purchase', 'Lease Purchase'),
        ('Outright Purchase', 'Outright Purchase'),
        ('Lease', 'Lease'),
        ('Exchange', 'Exchange'),
        ('Part out', 'Part out'),
        ('cash', 'cash'),
    )
    terms = models.CharField(choices=TERMS_CHOICES,max_length=17, blank=True)
    country = models.ForeignKey('connect.AbCountries', models.DO_NOTHING,blank=True, null=True)
    wanted_by = models.DateTimeField(blank=True, null=True)
    comments = models.TextField(blank=True, null=True)
    primary_contact = models.ForeignKey('connect.AbContacts', models.DO_NOTHING, db_column='primary_contact')
    custom = models.TextField(blank=True, null=True)
    is_active = models.IntegerField(default=False)
    is_featured = models.IntegerField(default=False)
    is_published = models.IntegerField(default=False)
    promote_status = models.IntegerField(default=False)
    views = models.IntegerField(default=False)
    likes = models.IntegerField(default=False)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'ab_wanteds'
        ordering = ['-updated_at']


class AbSettings(models.Model):
    title = models.CharField(max_length=191)
    key = models.CharField(max_length=191)
    value = models.CharField(max_length=191)
    type = models.IntegerField(default=False)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        db_table = 'ab_settings'
