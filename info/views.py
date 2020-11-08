from django.shortcuts import render
from info.models import *
from item.models import *
from info.serializers import *
from rest_framework import viewsets,filters, generics, status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.request import Request
from rest_framework.response import Response
import json
from django.forms.models import model_to_dict
from rest_framework_datatables.filters import DatatablesFilterBackend
from default.views import CommonViewset
# Create your views here.

from rest_framework.status import (
	HTTP_400_BAD_REQUEST,
	HTTP_404_NOT_FOUND,
	HTTP_200_OK,
	HTTP_204_NO_CONTENT
)
from connect.views import safe_delete
from default.views import CommonViewset
from rest_framework.decorators import api_view
from account.models import AbUsers, AbManufacturers, AbTypes, AbModels, AbTitles
from connect.models import AbContacts, AbDepartments, AbSpecialities, AbCities, AbStates
from django.contrib.auth.models import Group
from default.services import to_dict

class CategoryViewSet(CommonViewset, generics.RetrieveAPIView):
	queryset = AbCategories.objects.filter(deleted_at=None)
	serializer_class = CategorySerializer

	filter_backends = (filters.OrderingFilter, filters.SearchFilter,)
	ordering_fields = ('id', 'name')
	filter_fields = ('id', 'is_active', 'type')
	search_fields = ('id', 'name')

	def get_queryset(self):
		queryset = AbCategories.objects.filter(deleted_at=None)
		is_active = self.request.query_params.get('is_active', None)
		if is_active is not None:
			queryset = queryset.filter(is_active=is_active)
		return queryset


	def list(self, request, *args, **kwargs):
		records = request.GET.get('records', None)
		queryset = self.filter_queryset(self.get_queryset())
		page = self.paginate_queryset(queryset)
		if page is not None and records is None:
			serializer = self.get_serializer(page, many=True)
			return self.get_paginated_response(serializer.data)
		serializer = self.get_serializer(queryset, many=True)
		return Response(serializer.data)

	def perform_create(self, serializer):
		return serializer.save()

	def create(self, request):
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		self.perform_create(serializer)
		self.get_success_headers(serializer.data)
		return Response(serializer.data)

	def retrieve(self, request: Request, *args, **kwargs):
		instance = self.get_object()
		serializer = self.get_serializer(instance)
		data = serializer.data
		data['media'] = AbMedias.get_media(instance, 'App\\Category')
		return Response(data)

	def destroy(self, request, *args, **kwargs):
		resp = safe_delete(self, request, AbCategories)
		return resp


#######Ab          Configurations        ######

class ConfigurationViewSet(CommonViewset, generics.RetrieveAPIView):

	queryset = AbConfigurations.objects.filter(deleted_at=None)
	serializer_class = ConfigurationsSerializer
	filter_backends = (filters.OrderingFilter,filters.SearchFilter,)
	ordering_fields = ('id','name')
	filter_fields = ('id','is_active')
	search_fields = ('id','name')

	def list(self, request, *args, **kwargs):
		records = request.GET.get('records', None)
		queryset = self.filter_queryset(self.get_queryset())
		page = self.paginate_queryset(queryset)
		if page is not None and records is None:
			serializer = self.get_serializer(page, many=True)
			return self.get_paginated_response(serializer.data)
		serializer = self.get_serializer(queryset, many=True)
		return Response(serializer.data)

	def perform_create(self, serializer):
		return serializer.save()

	def create(self, request):
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		self.perform_create(serializer)
		return Response(serializer.data)

	def retrieve(self, request: Request, *args, **kwargs):
		instance = self.get_object()
		serializer = self.get_serializer(instance)
		return Response(serializer.data)

	def destroy(self, request, *args, **kwargs):
		resp = safe_delete(self, request, AbConfigurations)
		return resp

class ReleasesViewSet(CommonViewset, generics.RetrieveAPIView):

	queryset = AbReleases.objects.filter(deleted_at=None)
	serializer_class = ReleasesSerializer
	filter_backends = (filters.OrderingFilter, filters.SearchFilter,)
	ordering_fields = ('id', 'name')
	filter_fields = ('id', 'is_active')
	search_fields = ('id', 'name')

	def list(self, request, *args, **kwargs):
		records = request.GET.get('records', None)
		queryset = self.filter_queryset(self.get_queryset())
		page = self.paginate_queryset(queryset)
		if page is not None and records is None:
			serializer = self.get_serializer(page, many=True)
			return self.get_paginated_response(serializer.data)
		serializer = self.get_serializer(queryset, many=True)
		return Response(serializer.data)

	def perform_create(self, serializer):
		return serializer.save()

	def retrieve(self, request: Request, *args, **kwargs):
		instance = self.get_object()
		serializer = self.get_serializer(instance)
		return Response(serializer.data)

	def destroy(self, request, *args, **kwargs):
		resp = safe_delete(self, request, AbReleases)
		return resp


class NewsViewSet(CommonViewset, generics.RetrieveAPIView):
	queryset = AbNews.objects.filter(deleted_at=None)
	serializer_class = NewsSerializer
	filter_backends = (filters.OrderingFilter, filters.SearchFilter, )
	ordering_fields = ('id', 'title','date','company__name')
	filter_fields = ('id', 'is_active')
	search_fields = ('id', 'title','date','company__name')

	def list(self, request, *args, **kwargs):
		queryset = self.filter_queryset(self.get_queryset())
		page = self.paginate_queryset(queryset)
		if page is not None:
			serializer = self.get_serializer(page, many=True)
			return self.get_paginated_response(serializer.data)
		serializer = self.get_serializer(queryset, many=True)
		return Response(serializer.data)

	def perform_create(self, serializer):
		return serializer.save()

	def retrieve(self, request: Request, *args, **kwargs):
		instance = self.get_object()
		serializer = self.get_serializer(instance)
		data = serializer.data
		data['media'] = AbMedias.get_media(instance, 'App\\News')

		related_models = ['country','region','continent']
		
		for model in related_models:
			try:
				data[model] = to_dict(getattr(instance, model))
			except:
				data[model] = None

		try:
			data['categories'] = instance.categories.values()
		except:
			data['categories'] = None
		return Response(data)

	def destroy(self, request, *args, **kwargs):
		resp = safe_delete(self, request, AbNews)
		return resp

class EmailsViewSet(CommonViewset, generics.RetrieveAPIView):
	queryset = AbCannedemails.objects.filter(deleted_at=None)
	serializer_class = EmailsSerializer
	filter_backends = (filters.OrderingFilter, filters.SearchFilter,)
	ordering_fields = ('id', 'subject', 'message_type')
	filter_fields = ('id', 'is_active')
	search_fields = ('id', 'subject', 'message_type')

	def list(self, request, *args, **kwargs):
		records = request.GET.get('records', None)
		queryset = self.filter_queryset(self.get_queryset())
		page = self.paginate_queryset(queryset)
		if page is not None and records is None:
			serializer = self.get_serializer(page, many=True)
			return self.get_paginated_response(serializer.data)
		serializer = self.get_serializer(queryset, many=True)
		return Response(serializer.data)

	def perform_create(self, serializer):
		return serializer.save()

	def retrieve(self, request: Request, *args, **kwargs):
		instance = self.get_object()
		serializer = self.get_serializer(instance)
		return Response(serializer.data)

	def destroy(self, request, *args, **kwargs):
		resp = safe_delete(self, request, AbCannedemails)
		return resp


class CmsViewSet(CommonViewset, generics.RetrieveAPIView):
	queryset = AbCms.objects.filter(deleted_at=None)
	serializer_class = CmsSerializer
	filter_backends = (filters.OrderingFilter, filters.SearchFilter,)
	ordering_fields = ('id', 'title')
	filter_fields = ('id', 'is_active')
	search_fields = ('id', 'title')

	def list(self, request, *args, **kwargs):
		records = request.GET.get('records', None)
		queryset = self.filter_queryset(self.get_queryset())
		page = self.paginate_queryset(queryset)
		if page is not None and records is None:
			serializer = self.get_serializer(page, many=True)
			return self.get_paginated_response(serializer.data)
		serializer = self.get_serializer(queryset, many=True)
		return Response(serializer.data)

	def perform_create(self, serializer):
		return serializer.save()

	def retrieve(self, request: Request, *args, **kwargs):
		instance = self.get_object()
		serializer = self.get_serializer(instance)
		data = serializer.data
		data['media'] = AbMedias.get_media(instance, 'App\\Cms')
		return Response(data)

	def destroy(self, request, *args, **kwargs):
		resp = safe_delete(self, request, AbCms)
		return resp


class SeoViewSet(CommonViewset, generics.RetrieveAPIView):
	queryset = AbSeos.objects.filter(deleted_at=None)
	serializer_class = SeoSerializer
	filter_backends = (filters.OrderingFilter, filters.SearchFilter, )
	ordering_fields = ('id', 'title')
	filter_fields = ('id', 'is_active')
	search_fields = ('id', 'title')

	def list(self, request, *args, **kwargs):
		records = request.GET.get('records', None)
		queryset = self.filter_queryset(self.get_queryset())
		page = self.paginate_queryset(queryset)
		if page is not None and records is None:
			serializer = self.get_serializer(page, many=True)
			return self.get_paginated_response(serializer.data)
		serializer = self.get_serializer(queryset, many=True)
		return Response(serializer.data)

	def perform_create(self, serializer):
		return serializer.save()

	def retrieve(self, request: Request, *args, **kwargs):
		instance = self.get_object()
		serializer = self.get_serializer(instance)
		data = serializer.data
		data['media'] = AbMedias.get_media(instance, 'App\\Seo')
		return Response(data)

	def destroy(self, request, *args, **kwargs):
		resp = safe_delete(self, request, AbSeos)
		return resp


class PaymenthistoriesViewSet(CommonViewset, generics.RetrieveAPIView):
	queryset = AbPaymentHistories.objects.filter(deleted_at=None)
	serializer_class = PaymenthistoriesSerializer
	filter_backends = (filters.OrderingFilter, filters.SearchFilter,)
	ordering_fields = ('id',)
	filter_fields = ('id',)
	search_fields = ('id',)

	def list(self, request, *args, **kwargs):
		records = request.GET.get('records', None)
		queryset = self.filter_queryset(self.get_queryset())
		page = self.paginate_queryset(queryset)
		if page is not None and records is None:
			serializer = self.get_serializer(page, many=True)
			return self.get_paginated_response(serializer.data)
		serializer = self.get_serializer(queryset, many=True)
		return Response(serializer.data)

	def perform_create(self, serializer):
		return serializer.save()

	def retrieve(self, request: Request, *args, **kwargs):
		instance = self.get_object()
		serializer = self.get_serializer(instance)
		return Response(serializer.data)

	def destroy(self, request, *args, **kwargs):
		resp = safe_delete(self, request, AbPaymentHistories)
		return resp


class MediasViewSet(viewsets.ModelViewSet, generics.RetrieveAPIView):
	queryset = AbMedias.objects.order_by('-created_at')
	serializer_class = MediasSerializer
	filter_backends = (filters.OrderingFilter, filters.SearchFilter, DjangoFilterBackend,)
	ordering_fields = ('id','meta_name','created_at' )
	filter_fields = ('id','mediable_type',)
	search_fields = ('id','meta_name')

	def list(self, request, *args, **kwargs):
		queryset = self.filter_queryset(self.get_queryset())
		media_type = request.GET.get('mediable_type', None)
		mediableId = request.GET.get('mediableId', None)
		if media_type == 'App\\User':
			if not request.user.groups.filter(name = 'Admin').exists():
				mediable_id = request.user.id
			queryset = queryset.filter(mediable_id=mediableId)
		elif media_type == 'Global':
			queryset = queryset.filter(mediable_id=1)
		# page = self.paginate_queryset(queryset)
		# if page is not None:
		#     serializer = self.get_serializer(page, many=True)
		#     return self.get_paginated_response(serializer.data)
		serializer = self.get_serializer(queryset, many=True)
		return Response(serializer.data)

	def perform_create(self, serializer):
		return serializer.save()

	def retrieve(self, request: Request, *args, **kwargs):
		instance = self.get_object()
		serializer = self.get_serializer(instance)
		return Response(serializer.data)

	def destroy(self, request, *args, **kwargs):
		request_data = json.loads(request.body.decode('utf-8'))
		if 'ids' in request_data:
			# delete images files
			for id_ in request_data['ids']:
				abmedia = AbMedias.objects.get(id=id_)
				abmedia._delete_file()
				
			AbMedias.objects.filter(id__in=request_data['ids']).delete()
			return Response(status=HTTP_204_NO_CONTENT)
		else:
			return super(MediasViewSet, self).destroy(request, *args, **kwargs)


class AdvertisementsViewSet(CommonViewset, generics.RetrieveAPIView):
	queryset = AbAdvertisements.objects.filter(deleted_at=None)
	serializer_class = AdvertisementsSerializer
	filter_backends = (filters.OrderingFilter, filters.SearchFilter,)
	ordering_fields = ('id',)
	filter_fields = ('id','is_active')
	search_fields = ('id',)

	def list(self, request, *args, **kwargs):
		queryset = self.filter_queryset(self.get_queryset())
		page = self.paginate_queryset(queryset)
		if page is not None:
			serializer = self.get_serializer(page, many=True)
			return self.get_paginated_response(serializer.data)
		serializer = self.get_serializer(queryset, many=True)
		return Response(serializer.data)

	def perform_create(self, serializer):
		return serializer.save()

	def retrieve(self, request: Request, *args, **kwargs):
		instance = self.get_object()
		serializer = self.get_serializer(instance)
		data = serializer.data
		data['media'] = AbMedias.get_media(instance, 'App\\Advertisements')
		return Response(data)

	def destroy(self, request, *args, **kwargs):
		resp = safe_delete(self, request, AbAdvertisements)
		return resp


class PlansViewSet(viewsets.ModelViewSet, generics.RetrieveAPIView):
	queryset = AbPlans.objects.filter(deleted_at=None)
	serializer_class = PlansSerializer
	filter_backends = (filters.OrderingFilter, filters.SearchFilter, DjangoFilterBackend,)
	ordering_fields = ('id','title')
	filter_fields = ('id','is_active')
	search_fields = ('id','title')

	def list(self, request, *args, **kwargs):
		queryset = self.filter_queryset(self.get_queryset())
		page = self.paginate_queryset(queryset)
		if page is not None:
			serializer = self.get_serializer(page, many=True)
			return self.get_paginated_response(serializer.data)
		serializer = self.get_serializer(queryset, many=True)
		return Response(serializer.data)

	def perform_create(self, serializer):
		return serializer.save()

	def retrieve(self, request: Request, *args, **kwargs):
		instance = self.get_object()
		serializer = self.get_serializer(instance)
		data = serializer.data
		data['media'] = AbMedias.get_media(instance, 'App\\Plans')
		return Response(data)

	def destroy(self, request, *args, **kwargs):
		resp = safe_delete(self, request, AbPlans)
		return resp


class PointsViewSet(viewsets.ModelViewSet, generics.RetrieveAPIView):
	queryset = AbPoints.objects.filter(deleted_at=None)
	serializer_class = PointsSerializer
	filter_backends = (filters.OrderingFilter, filters.SearchFilter, DjangoFilterBackend,)
	ordering_fields = ('id','plan__name','plane__title')
	filter_fields = ('id',)
	search_fields = ('id','plan__name','plane__title')

	def list(self, request, *args, **kwargs):
		queryset = self.filter_queryset(self.get_queryset())
		page = self.paginate_queryset(queryset)
		if page is not None:
			serializer = self.get_serializer(page, many=True)
			return self.get_paginated_response(serializer.data)
		serializer = self.get_serializer(queryset, many=True)
		return Response(serializer.data)

	def perform_create(self, serializer):
		return serializer.save()

	def retrieve(self, request: Request, *args, **kwargs):
		instance = self.get_object()
		serializer = self.get_serializer(instance)
		return Response(serializer.data)

	def destroy(self, request, *args, **kwargs):
		resp = safe_delete(self, request, AbPoints)
		return resp


class AttachesViewSet(viewsets.ModelViewSet, generics.RetrieveAPIView):
	queryset = AbAttaches.objects.filter(deleted_at=None)
	serializer_class = AttachesSerializer
	filter_backends = (filters.OrderingFilter, filters.SearchFilter, DjangoFilterBackend,)
	ordering_fields = ('id')
	filter_fields = ('id',)
	search_fields = ('id',)

	def list(self, request, *args, **kwargs):
		queryset = self.filter_queryset(self.get_queryset())
		page = self.paginate_queryset(queryset)
		if page is not None:
			serializer = self.get_serializer(page, many=True)
			return self.get_paginated_response(serializer.data)
		serializer = self.get_serializer(queryset, many=True)
		return Response(serializer.data)

	def perform_create(self, serializer):
		return serializer.save()

	def retrieve(self, request: Request, *args, **kwargs):
		instance = self.get_object()
		serializer = self.get_serializer(instance)
		return Response(serializer.data)

	def destroy(self, request, *args, **kwargs):
		resp = safe_delete(self, request, AbAttachments)
		return resp

@api_view(['POST'])
def abmodels(request):
	models = request.data.get('models')
	allowed_models = [
		'AbUsers','AbCategories','AbContacts','AbConfigurations','AbManufacturers',
		'AbCountries','AbCompanies','AbTypes','AbModels', 'AbConditions', 'AbReleases',
		'AbDepartments', 'AbTitles', 'AbSpecialities', 'AbContinents', 'AbRegions', 'AbStates', 'AbCities',
		'AbAirfieldTypes', 'Group']
	output = {}
	for model in models:
		 # duplicated models will end by __{keyword}
		ending = None
		if '__' in model: 
			model_, ending = model.split('__')
		else:
			model_ = model
		# check if model is allowed 
		if model_ in allowed_models:
			abmodel = globals()[model_] # make model object
			if model == 'Group':
				queryset = abmodel.objects.filter()
			else:
				queryset = abmodel.objects.filter(deleted_at=None)

			# special case for user currently
			if model == 'AbUsers':
				abmodel = AbContacts
				queryset = abmodel.objects.filter(deleted_at=None).exclude(user=None).filter(user__groups__name__in=['user','User'])
				
			# check if model has field is_active
			if hasattr(abmodel, 'is_active'):
				queryset = queryset.filter(is_active=1)
			# apply filters on base of user params
			kwargs = {}
			for param in models[model]:
				# check if model has field mentionend in param
				# if hasattr(abmodel, param): # not work for many to many related field :(
				try:
					kwargs['{}'.format(param)] = models[model][param]
				except:
					pass
			if kwargs:
				queryset = queryset.filter(**kwargs)
	
			# default_option = [{"id" : "", "name" : "--None--"}]
			# output[model] = default_option + list(queryset.values())
			output[model] = queryset.values()
	return Response(output, status=HTTP_200_OK)



