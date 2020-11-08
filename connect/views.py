from connect.models import *
from connect.serializers import *
from rest_framework import viewsets, filters, generics
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.request import Request
from rest_framework.response import Response
from connect.models import AbSpecialities, AbDepartments, AbCountries, AbCities, AbStates
from info.models import AbMedias
from account.models import AbUsers
from rest_framework.status import (
	HTTP_400_BAD_REQUEST,
	HTTP_404_NOT_FOUND,
	HTTP_200_OK,
	HTTP_204_NO_CONTENT)

from django.http import JsonResponse
from default.views import CommonViewset
import json
from default.views import *
from default.services import to_dict

class ContinentsViewSet(CommonViewset, generics.RetrieveAPIView):

	queryset = AbContinents.objects.filter(deleted_at=None)
	serializer_class = ContinentsSerializer
	filter_backends = (filters.OrderingFilter,filters.SearchFilter,)
	ordering_fields = ('id', 'name',)
	filter_fields = ('id', 'is_active',)
	search_fields = ('id', 'name',)


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
		resp = safe_delete(self, request, AbContinents)
		return resp

class RegionsViewSet(CommonViewset, generics.RetrieveAPIView):

	queryset = AbRegions.objects.filter(deleted_at=None)
	serializer_class = RegionsSerializer
	filter_backends = (filters.OrderingFilter,filters.SearchFilter,)
	ordering_fields = ('id', 'name',)
	filter_fields = ('id', 'is_active','continent_id')
	search_fields = ('id', 'name',)


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
		try:
			data['continent'] = to_dict(instance.continent)
		except:
			data['continent'] = None
		return Response(data)

	def destroy(self, request, *args, **kwargs):
		resp = safe_delete(self, request, AbRegions)
		return resp

class CountryViewSet(CommonViewset, generics.RetrieveAPIView):

	queryset = AbCountries.objects.filter(deleted_at=None)
	serializer_class = CountrySerializer
	filter_backends = (filters.OrderingFilter,filters.SearchFilter,)
	ordering_fields = ('id', 'name','continent__name','region__name')
	filter_fields = ('id','is_active','region_id')
	search_fields = ('id', 'name','continent__name','region__name')


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
		data['media'] = AbMedias.get_media(instance, 'App\\Country')
		return Response(data)

	def destroy(self, request, *args, **kwargs):
		resp = safe_delete(self, request, AbCountries)
		return resp


class StatesViewSet(CommonViewset, generics.RetrieveAPIView):

	queryset = AbStates.objects.filter(deleted_at=None)
	serializer_class = StatesSerializer
	filter_backends = (filters.OrderingFilter,filters.SearchFilter,)
	ordering_fields = ('id', 'name',)
	filter_fields = ('id','is_active','country_id')
	search_fields = ('id', 'name','country__name')

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
		resp = safe_delete(self, request, AbStates)
		return resp

class CityViewSet(CommonViewset, generics.RetrieveAPIView):

	queryset = AbCities.objects.filter(deleted_at=None)
	serializer_class = CitySerializer
	filter_backends = (filters.OrderingFilter,filters.SearchFilter,)
	ordering_fields =  ('id', 'name','state__name',)
	filter_fields = ('id', 'is_active','state_id')
	search_fields = ('id', 'name','state__name',)

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
		resp = safe_delete(self, request, AbCities)
		return resp

class CompanyViewSet(CommonViewset, generics.RetrieveAPIView):
	"""
	This viewset automatically provides `list` and `detail` actions.
	"""
	queryset = AbCompanies.objects.filter(deleted_at=None)
	serializer_class = CompanySerializer
	filter_backends = (filters.OrderingFilter,filters.SearchFilter,)
	ordering_fields = ('id', 'name','specialities__name',)
	filter_fields = ('id', 'is_active',)
	search_fields = ('id', 'name','specialities__name',)

	def list(self, request, *args, **kwargs):
		records = request.GET.get('records', None)
		available = request.GET.get('available', False)
		contact_id = request.GET.get('contact_id', None)
		queryset = self.filter_queryset(self.get_queryset())
		if available:
			contacts = AbContacts.objects.filter(company_id__isnull=False)
			if contact_id is not None:
				contacts = contacts.exclude(id=contact_id)

			queryset = queryset.exclude(id__in=contacts.values_list('company_id', flat=True))
		
		page = self.paginate_queryset(queryset)
		if page is not None and records is None:
			serializer = self.get_serializer(page, many=True)
			return self.get_paginated_response(serializer.data)
			
		serializer = self.get_serializer(queryset, many=True)
		return Response(serializer.data)

	def retrieve(self, request: Request, *args, **kwargs):
		instance = self.get_object()
		serializer = self.get_serializer(instance)
		data = serializer.data
		data['media'] = AbMedias.get_media(instance, 'App\\Company')

		related_models = ['country','city','state']
		
		for model in related_models:
			try:
				data[model] = to_dict(getattr(instance, model))
			except:
				data[model] = None
				
		return Response(data)

	def destroy(self, request, *args, **kwargs):
		resp = safe_delete(self, request, AbCompanies)
		return resp


class ContactViewSet(CommonViewset, generics.RetrieveAPIView):
	"""
	This viewset automatically provides `list` and `detail` actions.
	"""
	queryset = AbContacts.objects.filter(deleted_at=None)
	serializer_class = ContactSerializer
	filter_backends = (filters.OrderingFilter,filters.SearchFilter,)
	ordering_fields = ('id','name','job_title__name',)
	filter_fields = ('id',)
	search_fields = ('id','name','job_title__name',)

	def list(self, request, *args, **kwargs):
		records = request.GET.get('records', None)
		queryset = self.filter_queryset(self.get_queryset())
		page = self.paginate_queryset(queryset)
		if page is not None and records is None:
			serializer = self.get_serializer(page, many=True)
			return self.get_paginated_response(serializer.data)
		serializer = self.get_serializer(queryset, many=True)
		return Response(serializer.data)

	def retrieve(self, request: Request, *args, **kwargs):
		instance = self.get_object()
		serializer = self.get_serializer(instance)
		data = serializer.data
		# serializer['companies'] = AbCompanies.available_companies(instance)
		data['media'] = AbMedias.get_media(instance, 'App\\Contact')
		try:
			data['user'] = to_dict(instance.user)
			try:
				data['user']['contact'] = to_dict(instance.user.contact)
			except:
				data['user']['contact'] = None
		except:
			data['user'] = None

		related_models = ['department','country','city','state']
		
		for model in related_models:
			try:
				data[model] = to_dict(getattr(instance, model))
			except:
				data[model] = None

		return Response(data)

	def destroy(self, request, *args, **kwargs):
		resp = safe_delete(self, request, AbContacts)
		return resp


class ContactqueriesViewSet(CommonViewset, generics.RetrieveAPIView):
	queryset = AbContactQueries.objects.filter(deleted_at=None)
	serializer_class = ContactqueriesSerializer
	filter_backends = (filters.OrderingFilter,filters.SearchFilter,)
	ordering_fields = ('id','name','email','country__name')
	filter_fields = ('id','is_active',)
	search_fields = ('id','name','email','country__name')

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
		resp = safe_delete(self, request, AbContactQueries)
		return resp

# def contact_details(self):
# 	return JsonResponse({
# 		'companies': AbCompanies.objects.filter(deleted_at=None),
# 		'departments': AbCompanies.objects.filter(deleted_at=None),
# 		'countries': AbCompanies.objects.filter(deleted_at=None),
# 		'states': AbCompanies.objects.filter(deleted_at=None),
# 		'cities': AbCompanies.objects.filter(deleted_at=None),
# 		'titles': AbCompanies.objects.filter(deleted_at=None),
# 		'religion': AbCompanies.objects.filter(deleted_at=None),
# 		})


class SpecialityViewSet(CommonViewset, generics.RetrieveAPIView):

	queryset = AbSpecialities.objects.filter(deleted_at=None)
	serializer_class = SpecialitySerializer
	filter_backends = (filters.OrderingFilter,filters.SearchFilter,)
	ordering_fields = ('id', 'name',)
	filter_fields = ('id', 'is_active',)
	search_fields = ('id', 'name',)

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
		resp = safe_delete(self, request, AbSpecialities)
		return resp


class DepartmentViewSet(CommonViewset, generics.RetrieveAPIView):

	queryset = AbDepartments.objects.filter(deleted_at=None)
	serializer_class = DepartmentSerializer
	filter_backends = (filters.OrderingFilter,filters.SearchFilter,)
	ordering_fields = ('id', 'name',)
	filter_fields = ('id', 'is_active',)
	search_fields = ('id', 'name',)

	def list(self, request, *args, **kwargs):
		records = request.GET.get('records', None)
		queryset = self.filter_queryset(self.get_queryset())
		page = self.paginate_queryset(queryset)
		if page is not None and records is None:
			serializer = self.get_serializer(page, many=True)
			return self.get_paginated_response(serializer.data)
		serializer = self.get_serializer(queryset, many=True)
		return Response(serializer.data)


class SpecialityViewSet(CommonViewset, generics.RetrieveAPIView):

	queryset = AbSpecialities.objects.filter(deleted_at=None)
	serializer_class = SpecialitySerializer
	filter_backends = (filters.OrderingFilter,filters.SearchFilter,)
	ordering_fields = ('id', 'name',)
	filter_fields = ('id', 'is_active',)
	search_fields = ('id', 'name',)

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
		resp = safe_delete(self, request, AbSpecialities)
		return resp

class LeadsViewSet(CommonViewset, generics.RetrieveAPIView):

	queryset = AbLeads.objects.filter(deleted_at=None)
	serializer_class = LeadsSerializer
	filter_backends = (filters.OrderingFilter,filters.SearchFilter,)
	ordering_fields = ('id',)
	filter_fields = ('id','is_active')
	search_fields = ('id',)

	def list(self, request, *args, **kwargs):
		queryset = self.filter_queryset(self.get_queryset())
		records = request.GET.get('records', None)
		if isRoleUser(request.user):
			if(request.query_params.get('layout') == 'dashboard'):
				queryset = queryset.filter(user=request.user)[:4]
			else:
				queryset = queryset.filter(user=request.user)
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
		resp = safe_delete(self, request, AbLeads)
		return resp

class LikeViewSet(CommonViewset, generics.RetrieveAPIView):

	queryset = AbLikes.objects.filter(deleted_at=None)
	serializer_class = LikesSerializer
	filter_backends = (filters.OrderingFilter,filters.SearchFilter,)
	ordering_fields = ('id',)
	filter_fields = ('id',)
	search_fields = ('id',)

	def list(self, request, *args, **kwargs):
		queryset = self.filter_queryset(self.get_queryset())
		records = request.GET.get('records', None)
		type = request.GET.get('type', None)

		if isRoleUser(request.user):
			queryset = queryset.filter(user=request.user)

		if type == 'connections':
			queryset = queryset.filter(likable_type='App\\Contact')

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
		resp = safe_delete(self, request, AbLikes)
		return resp

class FavouriteViewSet(CommonViewset, generics.RetrieveAPIView):

	queryset = AbFavourites.objects.filter(deleted_at=None)
	serializer_class = FavouritesSerializer
	filter_backends = (filters.OrderingFilter,filters.SearchFilter,)
	ordering_fields = ('id',)
	filter_fields = ('id',)
	search_fields = ('id',)

	def list(self, request, *args, **kwargs):
		queryset = self.filter_queryset(self.get_queryset())
		records = request.GET.get('records', None)
		type = request.GET.get('type', None)

		if isRoleUser(request.user):
			queryset = queryset.filter(user=request.user)

		if type == '!events':
			queryset = queryset.exclude(favouritable_type='App\\Event')

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
		resp = safe_delete(self, request, AbFavourites)
		return resp

def safe_delete(self, request, ModelName):
	instance = self.get_object()
	from datetime import datetime
	request_data = json.loads(request.body.decode('utf-8'))
	if 'ids' in request_data:
		ModelName.objects.filter(id__in=request_data['ids']).update(
			deleted_at=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
		return Response(status=HTTP_204_NO_CONTENT)
	else:
		instance.deleted_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
		instance.save()
		return Response(status=HTTP_204_NO_CONTENT)

