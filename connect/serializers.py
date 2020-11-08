from rest_framework import serializers
from connect import models
from rest_framework.validators import UniqueValidator
from account.models import AbUsers, AbTitles
import base64, six, uuid
from django.core.files.base import ContentFile
from info.models import AbMedias
from default.services import to_dict

class Base64ImageField(serializers.ImageField):

    def to_internal_value(self, data):

        if isinstance(data, six.string_types):
            if 'data:' in data and ';base64,' in data:
                header, data = data.split(';base64,')

            try:
                decoded_file = base64.b64decode(data)
            except TypeError:
                self.fail('invalid_image')

            file_name = str(uuid.uuid4())[:12] # 12 characters are more than enough.
            file_extension = self.get_file_extension(file_name, decoded_file)
            complete_file_name = "%s.%s" % (file_name, file_extension, )
            data = ContentFile(decoded_file, name=complete_file_name)

        return super(Base64ImageField, self).to_internal_value(data)

    def get_file_extension(self, file_name, decoded_file):
        import imghdr

        extension = imghdr.what(file_name, decoded_file)
        extension = "jpg" if extension == "jpeg" else extension

        return extension

    def from_native(self, data):
        if isinstance(data, basestring) and data.startswith('data:image'):
            # base64 encoded image - decode
            format, imgstr = data.split(';base64,')  # format ~= data:image/X,
            ext = format.split('/')[-1]  # guess file extension

            data = ContentFile(base64.b64decode(imgstr), name='temp.' + ext)

        return super(Base64ImageField, self).from_native(data)

class CompanySerializer(serializers.ModelSerializer):
    file = Base64ImageField(max_length=None, use_url=True, required=False)
    specialities = serializers.PrimaryKeyRelatedField(many=True, write_only=True, queryset=models.AbSpecialities.objects.all())

    def __init__(self, *args, **kwargs):
        super(CompanySerializer, self).__init__(*args, **kwargs)

    def create(self, validated_data):
        if 'file' in validated_data:
            file = validated_data.pop('file')
            company = super(CompanySerializer, self).create(validated_data)
            AbMedias(
                mediable_type='App\\Company',
                mediable_id=company.id,
                path='Company',
                original_file_name=file,
                is_active=1,
                accessibility=1,
                is_featured=0
            ).save()
        else:
            company = super(CompanySerializer, self).create(validated_data)
        return company

    def update(self, instance, validated_data):
        if 'file' in validated_data:
            file = validated_data.pop('file')
            media = AbMedias.objects.filter(mediable_type='App\\Company', mediable_id=instance.id)
            if media.exists():
                media.first()._delete_file()
                media.first().delete()

            AbMedias(
                mediable_type='App\\Company',
                mediable_id=instance.id,
                path='Company',
                original_file_name=file,
                is_active=1,
                accessibility=1,
                is_featured=0
            ).save()
        else:
            media = AbMedias.objects.filter(mediable_type='App\\Company', mediable_id=instance.id)
            if media.exists():
                media.first()._delete_file()
                media.first().delete()

        return super(CompanySerializer, self).update(instance, validated_data)

    def to_representation(self, instance):
        representation = super(CompanySerializer, self).to_representation(instance)
        try:
            representation['specialities'] = instance.specialities.values()
        except:
            representation['specialities'] = None

        try:
            records = self.context['request'].GET.get('records', None)
            if records is not None:
                # for csv case we need data for all columns
                related_models = ['city','state','country']

                for model in related_models:
                    try:
                        representation[model] = to_dict(getattr(instance, model))
                    except:
                        representation[model] = None
        except:
            pass

        return representation

    class Meta:
        model = models.AbCompanies
        fields = ('id','name','status','profile','zip_code','po_box','business_phone','address','city','specialities',
                  'state','country','logo','website','is_active','is_published','views',
                  'rfq_email','aog_email','file','deleted_at','created_at','updated_at')
        datatables_always_serialize = ('id','name','specialities', 'is_active')


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.AbDepartments
        fields = ('id','name','type','is_active','created_at','updated_at')

#######################    Continents Serializer    #################

class ContinentsSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(validators=[UniqueValidator(queryset=models.AbContinents.objects.all())], max_length=150)
    def __init__(self, *args, **kwargs):
        super(ContinentsSerializer, self).__init__(*args, **kwargs)

    class Meta:
        model = models.AbContinents
        fields = ('id','name','is_active','created_at','updated_at')
        datatables_always_serialize = ('id',)


#######################    Regions Serializer    #################

class RegionsSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(validators=[UniqueValidator(queryset=models.AbRegions.objects.all())], max_length=150)
    continent = serializers.PrimaryKeyRelatedField(read_only=False, queryset=models.AbContinents.objects.all())
    def __init__(self, *args, **kwargs):
        super(RegionsSerializer, self).__init__(*args, **kwargs)

    class Meta:
        model = models.AbRegions
        fields = ('id','name','is_active','continent_id','continent','created_at','updated_at')
        datatables_always_serialize = ('id',)


#######################    Country Serializer    #################

class CountrySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    file = Base64ImageField(max_length=None, use_url=True, required=False)
    name = serializers.CharField(validators=[UniqueValidator(queryset=models.AbCountries.objects.all())], max_length=150)
    continent = serializers.PrimaryKeyRelatedField(read_only=False, queryset=models.AbContinents.objects.all())
    region = serializers.PrimaryKeyRelatedField(read_only=False, queryset=models.AbRegions.objects.all())
    def __init__(self, *args, **kwargs):
        super(CountrySerializer, self).__init__(*args, **kwargs)

    def create(self, validated_data):
        if 'file' in validated_data:
            file = validated_data.pop('file')
            country = super(CountrySerializer, self).create(validated_data)
            AbMedias(
                mediable_type='App\\Country',
                mediable_id=country.id,
                path='Country',
                original_file_name=file,
                is_active=1,
                accessibility=1,
                is_featured=0
            ).save()
        else:
            country = super(CountrySerializer, self).create(validated_data)
        return country

    def update(self, instance, validated_data):
        if 'file' in validated_data:
            file = validated_data.pop('file')
            media = AbMedias.objects.filter(mediable_type='App\\Country', mediable_id=instance.id)
            if media.exists():
                media.first()._delete_file()
                media.first().delete()

            AbMedias(
                mediable_type='App\\Country',
                mediable_id=instance.id,
                path='Country',
                original_file_name=file,
                is_active=1,
                accessibility=1,
                is_featured=0
            ).save()
        return super(CountrySerializer, self).update(instance, validated_data)

    def to_representation(self, instance):
        representation = super(CountrySerializer, self).to_representation(instance)
        try:
            representation['continent'] = ContinentsSerializer(instance.continent).data
        except:
            representation['continent'] = None
        try:
            representation['region'] = RegionsSerializer(instance.region).data
        except:
            representation['region'] = None
        return representation

    class Meta:
        model = models.AbCountries
        fields = ('id','name','is_active','continent','continent_id','region','region_id','capital','currency','file','iso_3116_alpha_2','dialing_code','created_at','updated_at')
        datatables_always_serialize = ('id','continent', 'region')


#######################    States Serializer    #################

class StatesSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(validators=[UniqueValidator(queryset=models.AbStates.objects.all())], max_length=150)
    country = serializers.PrimaryKeyRelatedField(read_only=False, queryset=models.AbCountries.objects.all())

    def __init__(self, *args, **kwargs):
        super(StatesSerializer, self).__init__(*args, **kwargs)

    def to_representation(self, instance):
        representation = super(StatesSerializer, self).to_representation(instance)
        try:
            representation['country'] = CountrySerializer(instance.country).data
        except:
            representation['country'] = None
        return representation

    class Meta:
        model = models.AbStates
        fields = ('id','name','is_active','country_id','country','created_at','updated_at')
        datatables_always_serialize = ('id','country')


#######################    City Serializer    #################

class CitySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(validators=[UniqueValidator(queryset=models.AbCities.objects.all())], max_length=150)
    state = serializers.PrimaryKeyRelatedField(read_only=False, queryset=models.AbStates.objects.all())

    def __init__(self, *args, **kwargs):
        super(CitySerializer, self).__init__(*args, **kwargs)

    def to_representation(self, instance):
        representation = super(CitySerializer, self).to_representation(instance)
        representation['state'] = StatesSerializer(instance.state).data
        return representation

    class Meta:
        model = models.AbCities
        fields = ('id','name','is_active','state_id','state','created_at','updated_at')
        datatables_always_serialize = ('id','state')


class ContactSerializer(serializers.ModelSerializer):
    file = Base64ImageField(max_length=None, use_url=True, required=False)
    id = serializers.IntegerField(read_only=True)
    creator = serializers.PrimaryKeyRelatedField(required=False, write_only=True, queryset=AbUsers.objects.all())
    company = serializers.PrimaryKeyRelatedField(required=False, write_only=True, queryset=models.AbCompanies.objects.all())
    city = serializers.PrimaryKeyRelatedField(required=False, write_only=True, queryset=models.AbCities.objects.all())
    country = serializers.PrimaryKeyRelatedField(required=False, write_only=True, queryset=models.AbCountries.objects.all())
    # department = serializers.PrimaryKeyRelatedField(required=False, write_only=True, queryset=models.AbDepartments.objects.all())
    state = serializers.PrimaryKeyRelatedField(required=False, write_only=True, queryset=models.AbStates.objects.all())
    job_title = serializers.PrimaryKeyRelatedField(required=False, write_only=True, queryset=AbTitles.objects.all())

    def to_representation(self, instance):
        from account.serializers import TitlesSerializer, UsersSerializer
        representation = super(ContactSerializer, self).to_representation(instance)
        try:
            representation['job_title'] = TitlesSerializer(instance.job_title).data
        except:
            representation['job_title'] = None
        try:
            representation['company'] = CompanySerializer(instance.company).data
        except:
            representation['company'] = None
        return representation

    def create(self, validated_data):
        validated_data['creator'] = self.context['request'].user;
        if 'file' in validated_data:
            file = validated_data.pop('file')
            contact = super(ContactSerializer, self).create(validated_data)
            AbMedias(
                mediable_type='App\\Contact',
                mediable_id=contact.id,
                path='Contact',
                original_file_name=file,
                is_active=1,
                accessibility=1,
                is_featured=0
            ).save()

        else:
            contact = super(ContactSerializer, self).create(validated_data)

        return contact

    def update(self, instance, validated_data):
        if 'file' in validated_data:
            file = validated_data.pop('file')

            # delete old one
            media = AbMedias.objects.filter(mediable_type='App\\Contact',mediable_id=instance.id)
            if media.exists():
                media.first()._delete_file()
                media.first().delete()

            AbMedias(
                mediable_type='App\\Contact',
                mediable_id=instance.id,
                path='Contact',
                original_file_name=file,
                is_active=1,
                accessibility=1,
                is_featured=0
            ).save()
        else:
            # delete old one
            media = AbMedias.objects.filter(mediable_type='App\\Contact', mediable_id=instance.id)
            if media.exists():
                media.first()._delete_file()
                media.first().delete()

        return super(ContactSerializer, self).update(instance, validated_data)

    class Meta:
        model = models.AbContacts
        fields = ('id','first_name','last_name','company','address','birthday','business_phone','city','company','contact_date',
                  'country','created_at','creator','department','state', 'updated_at','skype','religion','preferred_contact_method',
                  'mobile_phone','file', 'message','linkedin','job_title','is_published','is_public','gender','title')
        datatables_always_serialize = ('id','first_name','last_name','company','job_title','is_published')
        extra_kwargs = {
            'company': {
                'validators': [],
            }
        }

#######################    Speciality Serializer    #################

class SpecialitySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(validators=[UniqueValidator(queryset=models.AbSpecialities.objects.all())], max_length=150)


    def __init__(self, *args, **kwargs):
        super(SpecialitySerializer, self).__init__(*args, **kwargs)

    class Meta:
        model = models.AbSpecialities
        fields = ('id','name','is_active','created_at','updated_at')
        datatables_always_serialize = ('id',)


class LeadsSerializer(serializers.ModelSerializer):
    #user = serializers.PrimaryKeyRelatedField(required=False, read_only=False, queryset=AbUsers.objects.all())
    def __init__(self, *args, **kwargs):
        super(LeadsSerializer, self).__init__(*args, **kwargs)

    def to_representation(self, instance):
        from account.serializers import UsersSerializer
        # from item.serializers import AircraftsSerializer
        representation = super(LeadsSerializer, self).to_representation(instance)

        try:
            records = self.context['request'].GET.get('records', None)
            if records is not None:
                try:
                    representation['user'] = to_dict(instance.user)
                    representation['user']['name'] = representation['user']['email']
                    try:
                        contact = to_dict(instance.user.contact)
                        representation['user']['name'] = contact.first_name+' '+contact.last_name
                    except:
                        pass
                except:
                    representation['user'] = None
        except:
            pass

        try:
            # if instance.leadable_type == 'App\\Contact':
            # representation['leadable'] = UsersSerializer(instance.leadable).data
            # elif instance.leadable_type == 'App\\Aircraft':
            #     print('air')
            #     print(AircraftsSerializer(instance.leadable_id).data)
            #     representation['leadable'] = AircraftsSerializer(instance.leadable_id).data
            
            leadable = AbUsers.objects.filter(id=instance.leadable.id)
            contact = leadable.first().contact.values()[0]
            representation['leadable'] = leadable.values()[0]
            representation['leadable']['contact'] = contact
        except:
            representation['leadable'] = None
        try:
            representation['creator'] = UsersSerializer(instance.creator).data
        except:
            representation['creator'] = None
        return representation

    class Meta:
        model = models.AbLeads
        fields = ('id','leadable','leadable_type','user','creator','lead_status','message','is_active','created_at','updated_at')
        datatables_always_serialize = ('id','creator','leadable','message')


class ContactqueriesSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        super(ContactqueriesSerializer, self).__init__(*args, **kwargs)

    def to_representation(self, instance):
        representation = super(ContactqueriesSerializer, self).to_representation(instance)
        try:
            records = self.context['request'].GET.get('records', None)
            if records is not None:
                # for csv case we need data for all columns
                related_models = ['country']

                for model in related_models:
                    try:
                        representation[model] = to_dict(getattr(instance, model))
                    except:
                        representation[model] = None
        except:
            pass

        return representation

    class Meta:
        model = models.AbContactQueries
        fields = ('id','name','email','phone','country','enquiry_type','status','message','is_active','created_at','updated_at')
        datatables_always_serialize = ('id',)

class LikesSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        super(LikesSerializer, self).__init__(*args, **kwargs)

    def to_representation(self, instance):
        from account.serializers import ContactSerializer as SimpleContactSerializer
        representation = super(LikesSerializer, self).to_representation(instance)
        representation['likeable'] = None
        if instance.likable_type == 'App\\Contact':
            if models.AbContacts.objects.filter(id=instance.likable_id).exists():
                representation['likeable'] = SimpleContactSerializer(models.AbContacts.objects.get(id=instance.likable_id)).data

        return representation

    class Meta:
        model = models.AbLikes
        fields = ('id','likable_id','likable_type','user','created_at','updated_at')
        datatables_always_serialize = ('id','likable_id','likable_type',)

class FavouritesSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        super(FavouritesSerializer, self).__init__(*args, **kwargs)

    def to_representation(self, instance):
        from account.serializers import ContactSerializer as SimpleContactSerializer
        representation = super(FavouritesSerializer, self).to_representation(instance)
        # if instance.favouritable_type == 'App\\Contact':
        #     representation['favouritable'] = SimpleContactSerializer(instance.likable_id).data
        # else:
        #     representation['favouritable'] = None
        return representation
        
    class Meta:
        model = models.AbFavourites
        fields = ('id','favouritable_id','favouritable_type','created_at','updated_at')
        datatables_always_serialize = ('id','favouritable_id','favouritable_type')

