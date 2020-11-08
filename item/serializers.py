from rest_framework import serializers
from item.models import *
from connect.models import *
from connect.serializers import *
from account.serializers import UsersSerializer,TypesSerializer, ManufacturersSerializer, ContactSerializer, ModalsSerializer
from info.models import AbCategories, AbAttaches
from info.serializers import CategorySerializer, ReleasesSerializer
from rest_framework.validators import UniqueValidator
from account.models import AbUsers, AbManufacturers, AbTypes, AbModels
import datetime
from default.services import to_dict



#######################    Conditions Serializer    Serializer  #################

class ConditionsSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(validators=[UniqueValidator(queryset=AbConditions.objects.all())], max_length=150)
    def __init__(self, *args, **kwargs):
        super(ConditionsSerializer, self).__init__(*args, **kwargs)

    class Meta:
        model = AbConditions
        fields = ('id','name','is_active','created_at','updated_at')
        datatables_always_serialize = ('id',)


#######################    Aircrafts  Serializer  #################

class AircraftsSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=False, queryset=AbUsers.objects.all())
    category = serializers.PrimaryKeyRelatedField(read_only=False, queryset=AbCategories.objects.all())
    #seller = serializers.PrimaryKeyRelatedField(write_only=True, queryset=AbCompanies.objects.all())

    def __init__(self, *args, **kwargs):
        super(AircraftsSerializer, self).__init__(*args, **kwargs)

        if 'data' in kwargs:
            if 'images' in kwargs['data']:
                self.fields['images'] = serializers.ListField()
                self.fields['attachments'] = serializers.ListField()

            user = kwargs['context']['request'].user
            if user and user.groups.filter(name = 'user').exists():
                self.fields['user'].required = False

    def create(self, validated_data):
        user = self.context['request'].user
        if user and user.groups.filter(name = 'user').exists():
            validated_data['user'] = user

        model = validated_data.get('model', None)

        manufacturer = validated_data.get('manufacturer', None)
        manufacturer = manufacturer.name if manufacturer is not None else ''

        type = validated_data.get('type', None)
        type = type.name if type is not None else ''

        offer_for = validated_data.get('offer_for', None)
        yom = validated_data.get('yom', None)

        if model is not None:
            title = '{}-{}-{}-available-for-{}-YOM-{}'.format(manufacturer, type, model.name, offer_for, yom)
        else:
            title = '{}-{}-available-for-{}-YOM-{}'.format(manufacturer, type, offer_for, yom)

        validated_data['title'] = title.replace(' ', '-')

        images = []
        if 'images' in validated_data:
            images = validated_data.pop('images')
            self.fields.pop('images')

        attachments = []    
        if 'attachments' in validated_data:
            attachments = validated_data.pop('attachments')
            self.fields.pop('attachments')

        # check if is featured true, set promotion date
        if validated_data.get('is_featured', 0):
            validated_data['promotion_date'] = datetime.datetime.now()

        abaircraft = AbAircrafts.objects.create(**validated_data)
        for image in images:
            AbMedias.objects.create(
                type=image['type'], 
                path=image['path'], 
                original_file_name=image['original_file_name'],
                is_featured=image['is_featured'],
                mediable_type="App\\Aircraft",
                mediable_id=abaircraft.id
                )

        # get new input attachments ids
        attachment_ids = [attachment['id'] for attachment in attachments]
        # link new attachments with user
        AbAttaches.objects.filter(id__in=attachment_ids, user=abaircraft.user).update(attachable_id=abaircraft.id)

        # delete unnecessary files which was selected but not linked to that user
        abattaches = AbAttaches.objects.filter(user=abaircraft.user, attachable_id=0)
        for abattach in abattaches:
            abattach._delete_file()
            abattach.delete()

        return abaircraft

    def update(self, instance, validated_data):

        user = self.context['request'].user
        if user and user.groups.filter(name = 'user').exists():
            validated_data['user'] = user

        if 'images' in validated_data:
            images = validated_data.pop('images')
            self.fields.pop('images')

            abmeidas = AbMedias.objects.filter(mediable_id=instance.id, mediable_type="App\\Aircraft")
            newImgsIds = [ image['id'] for image in images ]

            for abmedia in abmeidas:
                # code to delete images
                if abmedia.id not in newImgsIds:
                    abmedia.delete()
                else:
                    newImgsIds.remove(abmedia.id)
                    # code to update existing images
                    for image in images:
                        if image['id'] == abmedia.id:
                            abmedia.is_featured = image['is_featured']
                            abmedia.save()

            # code to save new images
            for image in images:
                if image['id'] in newImgsIds:
                    AbMedias.objects.create(
                        type=image['type'], 
                        path=image['path'], 
                        original_file_name=image['original_file_name'],
                        is_featured=image['is_featured'],
                        mediable_type="App\\Aircraft",
                        mediable_id=instance.id
                        )

        if 'attachments' in validated_data:
            attachments = validated_data.pop('attachments')
            self.fields.pop('attachments')

            # get old attachments
            abattaches = AbAttaches.objects.filter(attachable_id=instance.id, attachable_type="App\\Aircraft")
            
            # get new input attachments ids
            attachment_ids = [attachment['id'] for attachment in attachments]

            # check if any attachments is absent from input than removed that
            for abattach in abattaches:
                if abattach.id not in attachment_ids:
                    abattach._delete_file()
                    abattach.delete()

            # link new attachments with user
            AbAttaches.objects.filter(id__in=attachment_ids, user=instance.user).update(attachable_id=instance.id)

            # delete unnecessary files which was selected but not linked to that user
            abattaches = AbAttaches.objects.filter(user=instance.user, attachable_id=0)
            for abattach in abattaches:
                abattach._delete_file()
                abattach.delete()

        model = validated_data.get('model', None)

        manufacturer = validated_data.get('manufacturer', instance.manufacturer)
        manufacturer = manufacturer.name if manufacturer is not None else ''

        type = validated_data.get('type', instance.type)
        type = type.name if type is not None else ''

        offer_for = validated_data.get('offer_for', instance.offer_for)
        yom = validated_data.get('yom', instance.yom)

        if model is not None:
            title = '{}-{}-{}-available-for-{}-YOM-{}'.format(manufacturer, type, model.name, offer_for, yom)
        else:
            title = '{}-{}-available-for-{}-YOM-{}'.format(manufacturer, type, offer_for, yom)
      
        validated_data['title'] = title.replace(' ', '-')
        return super(AircraftsSerializer, self).update(instance, validated_data)

    def to_representation(self, instance):
        representation = super(AircraftsSerializer, self).to_representation(instance)
        related_models = ['type','model','manufacturer']

        try:
            records = self.context['request'].GET.get('records', None)
            if records is not None:
                # for csv case we need data for all columns
                related_models.extend(('category','owner','registration_country',
                    'current_operator','previous_operator','manager','seller','primary_contact',
                    'current_location','configuration','engine_type','engine_model','engine_manufacturer'
                    ))

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

        for model in related_models:
            try:
                representation[model] = to_dict(getattr(instance, model))
            except:
                representation[model] = None

        return representation

    class Meta:
        model = AbAircrafts
        fields = ('id', 'title','uid', 'user','model','type','category','msn','yom','seating_first_class','seating_business',
                  'seating_economy', 'offer_for', 'mgh', 'per_block_hour', 'cpd', 'price', 'terms', 'availability',
                  'status', 'registration_country', 'registration_number', 'owner', 'previous_operator',
                  'current_operator', 'manager', 'seller',
                  'primary_contact', 'current_location', 'configuration', 'tsn', 'csn', 'mtow', 'mlgw',
                  'last_c_check', 'promotion_date','manufacturer',
                  'compliance', 'engine_type', 'engine_model', 'engine_manufacturer', 'description',
                  'promote_status', 'views', 'likes', 'isactivestatus', 'status_reason', 'is_featured',
                  'is_active_by_user', 'is_published', 'deleted_at', 'created_at', 'updated_at'
                  )
        datatables_always_serialize = ('id','manufacturer','type','model','msn','offer_for', 'isactivestatus',)
        # extra_kwargs = {
        #     'manufacturer': {'required': True, 'allow_null': False},
        #     'type': {'required': True, 'allow_null': False},
        # } 


class EnginesSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=False, queryset=AbUsers.objects.all())
    category = serializers.PrimaryKeyRelatedField(read_only=False, queryset=AbCategories.objects.all())

    def __init__(self, *args, **kwargs):
        super(EnginesSerializer, self).__init__(*args, **kwargs)

        if 'data' in kwargs:
            if 'images' in kwargs['data']:
                self.fields['images'] = serializers.ListField()
                self.fields['attachments'] = serializers.ListField()

            user = kwargs['context']['request'].user
            if user and user.groups.filter(name = 'user').exists():
                self.fields['user'].required = False

    def create(self, validated_data):
        user = self.context['request'].user
        if user and user.groups.filter(name = 'user').exists():
            validated_data['user'] = user

        model = validated_data.get('model', None)

        manufacturer = validated_data.get('manufacturer', None)
        manufacturer = manufacturer.name if manufacturer is not None else ''

        type = validated_data.get('type', None)
        type = type.name if type is not None else ''

        offer_for = validated_data.get('offer_for', None)

        if model is not None:
            title = '{}-{}-{}-available-for-{}'.format(manufacturer, type, model.name, offer_for)
        else:
            title = '{}-{}-available-for-{}'.format(manufacturer, type, offer_for)
            
        validated_data['title'] = title.replace(' ', '-')

        images = []
        if 'images' in validated_data:
            images = validated_data.pop('images')
            self.fields.pop('images')

        attachments = []    
        if 'attachments' in validated_data:
            attachments = validated_data.pop('attachments')
            self.fields.pop('attachments')

        abengine = AbEngines.objects.create(**validated_data)
        for image in images:
            AbMedias.objects.create(
                type=image['type'], 
                path=image['path'], 
                original_file_name=image['original_file_name'],
                is_featured=image['is_featured'],
                mediable_type="App\\Engine",
                mediable_id=abengine.id
                )

        # get new input attachments ids
        attachment_ids = [attachment['id'] for attachment in attachments]
        # link new attachments with user
        AbAttaches.objects.filter(id__in=attachment_ids, user=abengine.user).update(attachable_id=abengine.id)

        # delete unnecessary files which was selected but not linked to that user
        abattaches = AbAttaches.objects.filter(user=abengine.user, attachable_id=0)
        for abattach in abattaches:
            abattach._delete_file()
            abattach.delete()

        return abengine

    def update(self, instance, validated_data):

        user = self.context['request'].user
        if user and user.groups.filter(name = 'user').exists():
            validated_data['user'] = user

        if 'images' in validated_data:
            images = validated_data.pop('images')
            self.fields.pop('images')

            abmeidas = AbMedias.objects.filter(mediable_id=instance.id, mediable_type="App\\Engine")
            newImgsIds = [ image['id'] for image in images ]

            for abmedia in abmeidas:
                if abmedia.id not in newImgsIds:
                    abmedia.delete()
                else:
                    newImgsIds.remove(abmedia.id)

            for image in images:
                if image['id'] in newImgsIds:
                    AbMedias.objects.create(
                        type=image['type'], 
                        path=image['path'], 
                        original_file_name=image['original_file_name'],
                        is_featured=image['is_featured'],
                        mediable_type="App\\Engine",
                        mediable_id=instance.id
                        )

        if 'attachments' in validated_data:
            attachments = validated_data.pop('attachments')
            self.fields.pop('attachments')

            # get old attachments
            abattaches = AbAttaches.objects.filter(attachable_id=instance.id, attachable_type="App\\Engine")
            
            # get new input attachments ids
            attachment_ids = [attachment['id'] for attachment in attachments]

            # check if any attachments is absent from input than removed that
            for abattach in abattaches:
                if abattach.id not in attachment_ids:
                    abattach._delete_file()
                    abattach.delete()

            # link new attachments with user
            AbAttaches.objects.filter(id__in=attachment_ids, user=instance.user).update(attachable_id=instance.id)

            # delete unnecessary files which was selected but not linked to that user
            abattaches = AbAttaches.objects.filter(user=instance.user, attachable_id=0)
            for abattach in abattaches:
                abattach._delete_file()
                abattach.delete()

        model = validated_data.get('model', None)

        manufacturer = validated_data.get('manufacturer', instance.manufacturer)
        manufacturer = manufacturer.name if manufacturer is not None else ''

        type = validated_data.get('type', instance.type)
        type = type.name if type is not None else ''

        offer_for = validated_data.get('offer_for', instance.offer_for)

        if model is not None:
            title = '{}-{}-{}-available-for-{}'.format(manufacturer, type, model.name, offer_for)
        else:
            title = '{}-{}-available-for-{}'.format(manufacturer, type, offer_for)
      
        validated_data['title'] = title.replace(' ', '-')
        return super(EnginesSerializer, self).update(instance, validated_data)

    def to_representation(self, instance):
        representation = super(EnginesSerializer, self).to_representation(instance)
        related_models = ['type','model','manufacturer']
        try:
            records = self.context['request'].GET.get('records', None)
            if records is not None:
                # for csv case we need data for all columns
                related_models.extend(('category','owner','seller','primary_contact', 'current_location', ))

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

        for model in related_models:
            try:
                representation[model] = to_dict(getattr(instance, model))
            except:
                representation[model] = None

        return representation

    class Meta:
        model = AbEngines
        fields = ('id', 'title','uid','user','manufacturer','model','type',
                  'category','offer_for','esn','status','availability','price','lease_terms',
                  'exchange_terms','description','current_location','owner','seller','primary_contact','cycle_remaining',
                  'thrust_rating','lsv_description','tso','status_reason','promotion_date','views','likes','isactivestatus',
                  'is_featured','is_active_by_user','is_published', 'deleted_at', 'created_at', 'updated_at'
                  )
        datatables_always_serialize = ('id','manufacturer','type','model','esn','offer_for')


class ApusSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=False, queryset=AbUsers.objects.all())
    category = serializers.PrimaryKeyRelatedField(read_only=False, queryset=AbCategories.objects.all())

    def __init__(self, *args, **kwargs):
        super(ApusSerializer, self).__init__(*args, **kwargs)

        if 'data' in kwargs:
            if 'images' in kwargs['data']:
                self.fields['images'] = serializers.ListField()
                self.fields['attachments'] = serializers.ListField()

            user = kwargs['context']['request'].user
            if user and user.groups.filter(name = 'user').exists():
                self.fields['user'].required = False

    def create(self, validated_data):
        user = self.context['request'].user
        if user and user.groups.filter(name = 'user').exists():
            validated_data['user'] = user

        model = validated_data.get('model', None)

        manufacturer = validated_data.get('manufacturer', None)
        manufacturer = manufacturer.name if manufacturer is not None else ''

        type = validated_data.get('type', None)
        type = type.name if type is not None else ''

        offer_for = validated_data.get('offer_for', None)

        if model is not None:
            title = '{}-{}-{}-available-for-{}'.format(manufacturer, type, model.name, offer_for)
        else:
            title = '{}-{}-available-for-{}'.format(manufacturer, type, offer_for)
            
        validated_data['title'] = title.replace(' ', '-')

        images = []
        if 'images' in validated_data:
            images = validated_data.pop('images')
            self.fields.pop('images')

        attachments = []    
        if 'attachments' in validated_data:
            attachments = validated_data.pop('attachments')
            self.fields.pop('attachments')

        apus = AbApus.objects.create(**validated_data)

        for image in images:
            AbMedias.objects.create(
                type=image['type'], 
                path=image['path'], 
                original_file_name=image['original_file_name'],
                is_featured=image['is_featured'],
                mediable_type="App\\Apu",
                mediable_id=apus.id
                )

        # get new input attachments ids
        attachment_ids = [attachment['id'] for attachment in attachments]
        # link new attachments with user
        AbAttaches.objects.filter(id__in=attachment_ids, user=apus.user).update(attachable_id=apus.id)

        # delete unnecessary files which was selected but not linked to that user
        abattaches = AbAttaches.objects.filter(user=apus.user, attachable_id=0)
        for abattach in abattaches:
            abattach._delete_file()
            abattach.delete()

        return apus

    def update(self, instance, validated_data):

        user = self.context['request'].user
        if user and user.groups.filter(name = 'user').exists():
            validated_data['user'] = user

        if 'images' in validated_data:
            images = validated_data.pop('images')
            self.fields.pop('images')

            abmeidas = AbMedias.objects.filter(mediable_id=instance.id, mediable_type="App\\Apu")
            newImgsIds = [ image['id'] for image in images ]

            for abmedia in abmeidas:
                if abmedia.id not in newImgsIds:
                    abmedia.delete()
                else:
                    newImgsIds.remove(abmedia.id)

            for image in images:
                if image['id'] in newImgsIds:
                    AbMedias.objects.create(
                        type=image['type'], 
                        path=image['path'], 
                        original_file_name=image['original_file_name'],
                        is_featured=image['is_featured'],
                        mediable_type="App\\Apu",
                        mediable_id=instance.id
                        )

        if 'attachments' in validated_data:
            attachments = validated_data.pop('attachments')
            self.fields.pop('attachments')

            # get old attachments
            abattaches = AbAttaches.objects.filter(attachable_id=instance.id, attachable_type="App\\Apu")
            
            # get new input attachments ids
            attachment_ids = [attachment['id'] for attachment in attachments]

            # check if any attachments is absent from input than removed that
            for abattach in abattaches:
                if abattach.id not in attachment_ids:
                    abattach._delete_file()
                    abattach.delete()

            # link new attachments with user
            AbAttaches.objects.filter(id__in=attachment_ids, user=instance.user).update(attachable_id=instance.id)

            # delete unnecessary files which was selected but not linked to that user
            abattaches = AbAttaches.objects.filter(user=instance.user, attachable_id=0)
            for abattach in abattaches:
                abattach._delete_file()
                abattach.delete()

        model = validated_data.get('model', None)

        manufacturer = validated_data.get('manufacturer', instance.manufacturer)
        manufacturer = manufacturer.name if manufacturer is not None else ''

        type = validated_data.get('type', instance.type)
        type = type.name if type is not None else ''

        offer_for = validated_data.get('offer_for', instance.offer_for)

        if model is not None:
            title = '{}-{}-{}-available-for-{}'.format(manufacturer, type, model.name, offer_for)
        else:
            title = '{}-{}-available-for-{}'.format(manufacturer, type, offer_for)
      
        validated_data['title'] = title.replace(' ', '-')
        return super(ApusSerializer, self).update(instance, validated_data)

    def to_representation(self, instance):
        representation = super(ApusSerializer, self).to_representation(instance)
        related_models = ['type','model','manufacturer']
        try:
            records = self.context['request'].GET.get('records', None)
            if records is not None:
                # for csv case we need data for all columns
                related_models.extend(('category','owner','seller','primary_contact', 'current_location', ))

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
            for model in related_models:
                try:
                    representation[model] = to_dict(getattr(instance, model))
                except:
                    representation[model] = None
        except:
            pass

        return representation

    class Meta:
        model = AbApus
        fields = ('id', 'title','uid','user','manufacturer','model','type','serial_number',
                  'category','offer_for','status','availability','price','lease_terms','promote_status','part_number',
                  'exchange_terms','description','current_location','owner','seller','primary_contact','cycle_remaining',
                  'thrust_rating','lsv_description','status_reason','promotion_date','views','likes','isactivestatus',
                  'is_featured','is_active_by_user','is_published', 'deleted_at', 'created_at', 'updated_at'
                  )
        datatables_always_serialize = ('id','manufacturer','type','model','serial_number','offer_for')

class PartsSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=False, queryset=AbUsers.objects.all())
    def __init__(self, *args, **kwargs):
        super(PartsSerializer, self).__init__(*args, **kwargs)

        if 'data' in kwargs:
            user = kwargs['context']['request'].user
            if user and user.groups.filter(name = 'user').exists():
                self.fields['user'].required = False

    def create(self, validated_data):

        user = self.context['request'].user
        if user and user.groups.filter(name = 'user').exists():
            validated_data['user'] = user

        part_number = validated_data.get('part_number', None)

        condition = validated_data.get('condition', None)
        condition = condition.name if condition is not None else ''

        title = '{}-{}-available-for-Sale'.format(part_number, condition)
            
        validated_data['title'] = title.replace(' ', '-')
        return AbParts.objects.create(**validated_data)

    def update(self, instance, validated_data):

        user = self.context['request'].user
        if user and user.groups.filter(name = 'user').exists():
            validated_data['user'] = user

        part_number = validated_data.get('part_number', instance.part_number)
        condition = validated_data.get('condition', instance.condition)
        condition = condition.name if condition is not None else ''

        title = '{}-{}-available-for-Sale'.format(part_number, condition)
            
        validated_data['title'] = title.replace(' ', '-')
        return super(PartsSerializer, self).update(instance, validated_data)


    def to_representation(self, instance):
        representation = super(PartsSerializer, self).to_representation(instance)
        try:
            records = self.context['request'].GET.get('records', None)
            if records is not None:
                related_models = []
                # for csv case we need data for all columns
                related_models.extend(('condition','owner','seller','primary_contact', 'release', ))
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

                for model in related_models:
                    try:
                        representation[model] = to_dict(getattr(instance, model))
                    except:
                        representation[model] = None
        except:
            pass

        return representation
    class Meta:
        model = AbParts
        fields = ('id', 'title','uid','user','part_number','alternate_part_number','price','condition','quantity','unit_measure',
                  'release','description','owner','seller','primary_contact','is_active','is_featured','location',
                  'is_published', 'deleted_at', 'created_at', 'updated_at','promote_status','views','likes'
                  )
        datatables_always_serialize = ('id',)


class WantedsSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=False, queryset=AbUsers.objects.all())
    country = serializers.PrimaryKeyRelatedField(required=True, write_only=True, queryset=AbCountries.objects.all())


    def __init__(self, *args, **kwargs):
        super(WantedsSerializer, self).__init__(*args, **kwargs)
        if 'data' in kwargs:
            if 'type' in kwargs['data']:
                type = kwargs['data']['type']
            else:
                type = ''
            if type == 'aircraft':
                self.fields['manufacturer'].required = True
                self.fields['yom'].required = True

            if type == 'apu' or type == 'parts':
                self.fields['part_number'].required = True

            if type == 'aircraft' or type == 'apu':
                self.fields['type_0'].required = True

            if type != '':
                self.fields['terms'].required = True

            user = kwargs['context']['request'].user
            if user and user.groups.filter(name = 'user').exists():
                self.fields['user'].required = False

    def create(self, validated_data):

        user = self.context['request'].user
        if user and user.groups.filter(name = 'user').exists():
            validated_data['user'] = user

        type = validated_data.get('type', None)
        type_0 = validated_data.get('type_0', None)
        type_0 = type_0.name if type_0 is not None else ''

        model = validated_data.get('model', None)
        model = model.name if model is not None else ''

        manufacturer = validated_data.get('manufacturer', None)
        manufacturer = manufacturer.name if manufacturer is not None else ''

        terms = validated_data.get('terms', None)
        part_number = validated_data.get('part_number', None)

        if model is not None and type != 'parts':
            title = '{}-{}-{}-wanted-for-{}'.format(manufacturer, type_0, model, terms)
        else:
            if type == 'parts':
                title = '{}-wanted-for-{}'.format(part_number, terms)
            else:
                title = '{}-{}-wanted-for-{}'.format(manufacturer, type_0, terms)
            
        validated_data['title'] = title.replace(' ', '-')
        return AbWanteds.objects.create(**validated_data)

    def update(self, instance, validated_data):

        user = self.context['request'].user
        if user and user.groups.filter(name = 'user').exists():
            validated_data['user'] = user

        type = validated_data.get('type', instance.type)
        type_0 = validated_data.get('type_0', instance.type_0)
        type_0 = type_0.name if type_0 is not None else ''

        model = validated_data.get('model', instance.model)
        model = model.name if model is not None else ''

        manufacturer = validated_data.get('manufacturer', instance.manufacturer)
        manufacturer = manufacturer.name if manufacturer is not None else ''

        terms = validated_data.get('terms', instance.terms)
        part_number = validated_data.get('part_number', instance.part_number)

        if model is not None and type != 'parts':
            title = '{}-{}-{}-wanted-for-{}'.format(manufacturer, type_0, model, terms)
        else:
            if type == 'parts':
                title = '{}-wanted-for-{}'.format(part_number, terms)
            else:
                title = '{}-{}-wanted-for-{}'.format(manufacturer, type_0, terms)
            
        validated_data['title'] = title.replace(' ', '-')
        return super(WantedsSerializer, self).update(instance, validated_data)

    def to_representation(self, instance):
        representation = super(WantedsSerializer, self).to_representation(instance)
        try:
            records = self.context['request'].GET.get('records', None)
            if records is not None:
                # for csv case we need data for all columns
                related_models = ['type_0','model','manufacturer','primary_contact',]

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

                for model in related_models:
                    try:
                        representation[model] = to_dict(getattr(instance, model))
                    except:
                        representation[model] = None
        except:
            pass

        return representation

    class Meta:
        model = AbWanteds
        fields = ('id', 'title','uid','user','type','type_0','manufacturer','model',
                  'part_number','yom','terms','country','wanted_by','comments','primary_contact','custom',
                  'is_active','is_featured','promote_status','views','likes',
                  'is_published', 'deleted_at', 'created_at', 'updated_at'
                  )
        datatables_always_serialize = ('id',)



#######################    AirportsSerializer  Serializer  #################

class AirportsSerializer(serializers.ModelSerializer):
    name = serializers.CharField(validators=[UniqueValidator(queryset=AbAirports.objects.all())], max_length=150)
    user = serializers.PrimaryKeyRelatedField(required=False, read_only=False, queryset=AbUsers.objects.all())
    # city = serializers.PrimaryKeyRelatedField(required=False, read_only=False, queryset=AbCities.objects.all())
    country = serializers.PrimaryKeyRelatedField(read_only=False, queryset=AbCountries.objects.all())
    # state = serializers.PrimaryKeyRelatedField(required=False, read_only=False, queryset=AbStates.objects.all())
    airfield_type = serializers.PrimaryKeyRelatedField(read_only=False, queryset=AbAirfieldTypes.objects.all())

    def to_representation(self, instance):
        representation = super(AirportsSerializer, self).to_representation(instance)
        related_models = ['city','country']

        try:
            records = self.context['request'].GET.get('records', None)
            if records is not None:
                # for csv case we need data for all columns
                related_models.extend(('user','airfield_type','state' ))

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

        for model in related_models:
            try:
                representation[model] = to_dict(getattr(instance, model))
            except:
                representation[model] = None

        return representation

    class Meta:
        model = AbAirports
        fields = ('id', 'name','user','city','country',
                  'state','airfield_type','iata_code','icao_code',
                  'time_zone','latitude','longitude','sunrise','sunset','views','is_published','is_active','created_at', 'updated_at')
        datatables_always_serialize = ('id','city', 'country', 'is_active')


#######################    AirfieldTypesSerializer  Serializer  #################

class AirfieldTypesSerializer(serializers.ModelSerializer):
    name = serializers.CharField(validators=[UniqueValidator(queryset=AbAirfieldTypes.objects.all())], max_length=150)
    class Meta:
        model = AbAirfieldTypes
        fields = ('id', 'name','is_active','created_at', 'updated_at')
        datatables_always_serialize = ('id',)


class EventsSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    file = Base64ImageField(max_length=None, use_url=True, required=False)
    title = serializers.CharField(validators=[UniqueValidator(queryset=AbEvents.objects.all())], max_length=150)
    continent = serializers.PrimaryKeyRelatedField(read_only=False, queryset=AbContinents.objects.all())
    region = serializers.PrimaryKeyRelatedField(read_only=False, queryset=AbRegions.objects.all())
    country = serializers.PrimaryKeyRelatedField(write_only=True, queryset=AbCountries.objects.all())
    # state = serializers.PrimaryKeyRelatedField(write_only=True, queryset=AbStates.objects.all(), required=False)
    # city = serializers.PrimaryKeyRelatedField(write_only=True, queryset=AbCities.objects.all(), required=False)
    categories = serializers.PrimaryKeyRelatedField(many=True, write_only=True, queryset=AbCategories.objects.all())
    def __init__(self, *args, **kwargs):
        super(EventsSerializer, self).__init__(*args, **kwargs)
    def create(self, validated_data):
        if 'file' in validated_data:
            file = validated_data.pop('file')
            event = super(EventsSerializer, self).create(validated_data)
            AbMedias(
                mediable_type='App\\Event',
                mediable_id=event.id,
                path='Event',
                original_file_name=file,
                is_active=1,
                accessibility=1,
                is_featured=0
            ).save()
        else:
            event = super(EventsSerializer, self).create(validated_data)
        return event

    def update(self, instance, validated_data):
        if 'file' in validated_data:
            file = validated_data.pop('file')
            media = AbMedias.objects.filter(mediable_type='App\\Event', mediable_id=instance.id)
            if media.exists():
                media.first()._delete_file()
                media.first().delete()

            AbMedias(
                mediable_type='App\\Event',
                mediable_id=instance.id,
                path='Event',
                original_file_name=file,
                is_active=1,
                accessibility=1,
                is_featured=0
            ).save()
        else:
            media = AbMedias.objects.filter(mediable_type='App\\Event', mediable_id=instance.id)
            if media.exists():
                media.first()._delete_file()
                media.first().delete()

        return super(EventsSerializer, self).update(instance, validated_data)

    def to_representation(self, instance):
        representation = super(EventsSerializer, self).to_representation(instance)
        try:
            representation['categories'] = instance.categories.values()
        except:
            representation['categories'] = None

        try:
            records = self.context['request'].GET.get('records', None)
            if records is not None:
                # for csv case we need data for all columns
                related_models = ['continent','region','country','state','city','location']

                for model in related_models:
                    try:
                        representation[model] = to_dict(getattr(instance, model))
                    except:
                        representation[model] = None
        except:
            pass

        return representation
        
    class Meta:
        model = AbEvents
        fields = ('id','title','continent','region','categories','country','state','city',
                  'start_date','end_date','website','location','address','details','file','is_active','views',
                  'created_at','updated_at')
        datatables_always_serialize = ('id','categories')