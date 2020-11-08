from django.shortcuts import render
from item.models import *
from item.serializers import *
from rest_framework import viewsets,filters, generics
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.request import Request
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponseRedirect
from rest_framework.response import Response
from rest_framework.status import (
	HTTP_400_BAD_REQUEST,
	HTTP_404_NOT_FOUND,
	HTTP_200_OK,
	HTTP_204_NO_CONTENT
)
import json
from connect.views import safe_delete
from default.views import CommonViewset, isRoleUser
import datetime
from info.models import AbPaymentHistories, AbPlans, AbCredits, AbCategories, AbConfigurations
from account.models import AbUsers, AbTypes
from connect.models import AbContacts, AbCountries
from default.services import createPayTabPage, to_dict
from rest_framework.decorators import api_view
from django.conf import settings
from django.forms.models import model_to_dict

class ConditionViewSet(CommonViewset, generics.RetrieveAPIView):

	queryset = AbConditions.objects.filter(deleted_at=None)
	serializer_class = ConditionsSerializer
	filter_backends = (filters.OrderingFilter,filters.SearchFilter,DjangoFilterBackend,)
	ordering_fields = ('id','name')
	filter_fields = ('id','is_active')
	search_fields = ('id','name')

	def list(self, request, *args, **kwargs):
		queryset = self.filter_queryset(self.get_queryset())
		records = request.GET.get('records', None)
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
		resp = safe_delete(self, request, AbConditions)
		return resp


class AircraftViewSet(CommonViewset, generics.RetrieveAPIView):

	queryset = AbAircrafts.objects.filter(deleted_at=None)
	serializer_class = AircraftsSerializer
	filter_backends = (filters.OrderingFilter,filters.SearchFilter,)
	ordering_fields = ('id','title','msn')
	filter_fields = ('id','isactivestatus')
	search_fields = ('id','title','msn')

	def list(self, request, *args, **kwargs):
		records = request.GET.get('records', None)
		queryset = self.filter_queryset(self.get_queryset())
		if isRoleUser(request.user):
			if(request.query_params.get('layout') == 'dashboard'):
				queryset = queryset.filter(user=request.user)[:4]
			else:
				queryset = queryset.filter(user=request.user)
		else:
			if (request.query_params.get('layout') == 'dashboard'):
				queryset = queryset.filter()[:5]

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
		data['media'] = AbMedias.get_media(instance, 'App\\Aircraft', True)
		data['attachments'] = AbAttaches.get_attaches(instance, 'App\\Aircraft')
		try:
			data['user'] = to_dict(instance.user)
			try:
				data['user']['contact'] = to_dict(instance.user.contact)
			except:
				data['user']['contact'] = None
		except:
			data['user'] = None

		related_models = ['category','current_location','primary_contact','registration_country',
		'owner','current_operator', 'previous_operator', 'configuration', 'manager', 'seller', 'engine_model',
		'engine_type','engine_manufacturer']
		
		for model in related_models:
			try:
				data[model] = to_dict(getattr(instance, model))
			except:
				data[model] = None

		return Response(data)

	def destroy(self, request, *args, **kwargs):
		resp = safe_delete(self, request, AbAircrafts)
		return resp


class EnginesViewSet(CommonViewset, generics.RetrieveAPIView):

	queryset = AbEngines.objects.filter(deleted_at=None)
	serializer_class = EnginesSerializer
	filter_backends = (filters.OrderingFilter,filters.SearchFilter,)
	ordering_fields = ('id','title','esn')
	filter_fields = ('id','title','esn','isactivestatus')
	search_fields = ('id','title','esn')

	def list(self, request, *args, **kwargs):
		records = request.GET.get('records', None)
		queryset = self.filter_queryset(self.get_queryset())
		if isRoleUser(request.user):
			if(request.query_params.get('layout') == 'dashboard'):
				queryset = queryset.filter(user=request.user)[:4]
			else:
				queryset = queryset.filter(user=request.user)
		else:
			if (request.query_params.get('layout') == 'dashboard'):
				queryset = queryset.filter()[:5]

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
		data['media'] = AbMedias.get_media(instance, 'App\\Engine', True)
		data['attachments'] = AbAttaches.get_attaches(instance, 'App\\Engine')
		try:
			user = AbUsers.objects.filter(id=instance.user.id)
			contact = user.first().contact.values()[0]
			data['user'] = user.values()[0]
			data['user']['contact'] = contact
		except:
			data['user'] = None

		related_models = ['category','type','model','manufacturer','current_location','primary_contact',
		'owner','seller']
		
		for model in related_models:
			try:
				data[model] = to_dict(getattr(instance, model))
			except:
				data[model] = None
		return Response(data)


	def destroy(self, request, *args, **kwargs):
		resp = safe_delete(self, request, AbEngines)
		return resp


class ApusViewSet(CommonViewset, generics.RetrieveAPIView):

	queryset = AbApus.objects.filter(deleted_at=None)
	serializer_class = ApusSerializer
	filter_backends = (filters.OrderingFilter,filters.SearchFilter,)
	ordering_fields = ('id','title',)
	filter_fields = ('id','title','isactivestatus')
	search_fields = ('id','title',)

	def list(self, request, *args, **kwargs):
		records = request.GET.get('records', None)
		queryset = self.filter_queryset(self.get_queryset())
		if isRoleUser(request.user):
			if(request.query_params.get('layout') == 'dashboard'):
				queryset = queryset.filter(user=request.user)[:4]
			else:
				queryset = queryset.filter(user=request.user)
		else:
			if (request.query_params.get('layout') == 'dashboard'):
				queryset = queryset.filter()[:5]

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
		data['media'] = AbMedias.get_media(instance, 'App\\Apu', True)
		data['attachments'] = AbAttaches.get_attaches(instance, 'App\\Apu')
		try:
			user = AbUsers.objects.filter(id=instance.user.id)
			contact = user.first().contact.values()[0]
			data['user'] = user.values()[0]
			data['user']['contact'] = contact
		except:
			data['user'] = None

		related_models = ['category','type','model','manufacturer','current_location','primary_contact',
		'owner','seller']
		
		for model in related_models:
			try:
				data[model] = to_dict(getattr(instance, model))
			except:
				data[model] = None
				
		return Response(data)

	def destroy(self, request, *args, **kwargs):
		resp = safe_delete(self, request, AbApus)
		return resp


class PartsViewSet(CommonViewset, generics.RetrieveAPIView):

	queryset = AbParts.objects.filter(deleted_at=None)
	serializer_class = PartsSerializer
	filter_backends = (filters.OrderingFilter,filters.SearchFilter,)
	ordering_fields = ('id','title',)
	filter_fields = ('id','is_active',)
	search_fields = ('id','title',)

	def list(self, request, *args, **kwargs):
		records = request.GET.get('records', None)
		queryset = self.filter_queryset(self.get_queryset())
		if isRoleUser(request.user):
			if(request.query_params.get('layout') == 'dashboard'):
				queryset = queryset.filter(user=request.user)[:4]
			else:
				queryset = queryset.filter(user=request.user)
		else:
			if (request.query_params.get('layout') == 'dashboard'):
				queryset = queryset.filter()[:5]

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
			user = AbUsers.objects.filter(id=instance.user.id)
			contact = user.first().contact.values()[0]
			data['user'] = user.values()[0]
			data['user']['contact'] = contact
		except:
			data['user'] = None

		related_models = ['condition','primary_contact','owner','seller','release', 'location']
		
		for model in related_models:
			try:
				data[model] = to_dict(getattr(instance, model))
			except:
				data[model] = None

		return Response(data)

	def destroy(self, request, *args, **kwargs):
		resp = safe_delete(self, request, AbParts)
		return resp


class WantedsViewSet(CommonViewset, generics.RetrieveAPIView):

	queryset = AbWanteds.objects.filter(deleted_at=None)
	serializer_class = WantedsSerializer
	filter_backends = (filters.OrderingFilter,filters.SearchFilter,)
	ordering_fields = ('id','title',)
	filter_fields = ('id','is_active',)
	search_fields = ('id','title',)

	def list(self, request, *args, **kwargs):
		records = request.GET.get('records', None)
		queryset = self.filter_queryset(self.get_queryset())
		if isRoleUser(request.user):
			if(request.query_params.get('layout') == 'dashboard'):
				queryset = queryset.filter(user=request.user)[:4]
			else:
				queryset = queryset.filter(user=request.user)
		else:
			if (request.query_params.get('layout') == 'dashboard'):
				queryset = queryset.filter()[:5]

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
			user = AbUsers.objects.filter(id=instance.user.id)
			contact = user.first().contact.values()[0]
			data['user'] = user.values()[0]
			data['user']['contact'] = contact
		except:
			data['user'] = None

		related_models = ['country','primary_contact','manufacturer','type_0','model']
		
		for model in related_models:
			try:
				data[model] = to_dict(getattr(instance, model))
			except:
				data[model] = None

		return Response(data)

	def destroy(self, request, *args, **kwargs):
		resp = safe_delete(self, request, AbWanteds)
		return resp

class AirportsViewSet(CommonViewset, generics.RetrieveAPIView):

	queryset = AbAirports.objects.filter(deleted_at=None)
	serializer_class = AirportsSerializer
	filter_backends = (filters.OrderingFilter,filters.SearchFilter,)
	ordering_fields = ('id','name','city__name','country__name','iata_code','icao_code')
	filter_fields = ('id','is_active')
	search_fields = ('id','name','city__name','country__name','iata_code','icao_code')

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
			data['user'] = to_dict(instance.user)
			try:
				data['user']['contact'] = to_dict(instance.user.contact)
			except:
				data['user']['contact'] = None
		except:
			data['user'] = None

		related_models = ['state','airfield_type']
		
		for model in related_models:
			try:
				data[model] = to_dict(getattr(instance, model))
			except:
				data[model] = None

		return Response(data)

	def destroy(self, request, *args, **kwargs):
		resp = safe_delete(self, request, AbAirports)
		return resp


class AirfieldTypesViewSet(CommonViewset, generics.RetrieveAPIView):

	queryset = AbAirfieldTypes.objects.filter(deleted_at=None)
	serializer_class = AirfieldTypesSerializer
	filter_backends = (filters.OrderingFilter,filters.SearchFilter,)
	ordering_fields = ('id','name',)
	filter_fields = ('id','is_active',)
	search_fields = ('id','name',)

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
		resp = safe_delete(self, request, AbAirfieldTypes)
		return resp



class EventsViewSet(CommonViewset, generics.RetrieveAPIView):
	queryset = AbEvents.objects.filter(deleted_at=None)
	serializer_class = EventsSerializer
	filter_backends = (filters.OrderingFilter, filters.SearchFilter,)
	ordering_fields = ('id', 'title','start_date','end_date','categories')
	filter_fields = ('id', 'is_active')
	search_fields = ('id', 'title','start_date','end_date','categories__name')

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
		data['media'] = AbMedias.get_media(instance, 'App\\Event')

		related_models = ['country','region','continent','state','city']
		
		for model in related_models:
			try:
				data[model] = to_dict(getattr(instance, model))
			except:
				data[model] = None

		return Response(data)


	def destroy(self, request, *args, **kwargs):
		resp = safe_delete(self, request, AbEvents)
		return resp

@csrf_exempt
def paytab_ipn(request):
	transaction_id = request.POST.get('transaction_id', None)
	print('Paytab_ipn is called', flush=True)
	print(request.POST, flush=True)
	if transaction_id is not None:
		response_code = request.POST.get('response_code',0)
		if response_code in [100, 5001, 5002]:
			trans_date = request.POST.get('datetime')
			trans_date = datetime.datetime.strptime(trans_date, '%d-%m-%Y %I:%M:%S %p')
			# reference_no - combination of Ref-UserId-OrderId-RandomString
			ref_no = request.POST.get('reference_id','').split('-')
			user = AbUsers.objects.get(id=ref_no[1])
			user.order_id = ref_no[2]
			user.trans_date = trans_date
			user.card_brand = request.POST.get('card_brand','')
			user.card_last_four = request.POST.get('last_4_digits','')
			user.transaction_id = transaction_id
			# user.trial_ends_at = trans_date + 30/365 days - not sure if needed051
			user.save()

			# activate user credits
			user.abcredits_set.filter(is_active=0).update(is_active=1)

		# save transcation information
		AbPaymentHistories(
			user=user,
			transaction_id=transaction_id,
			order_id=ref_no[2],
			response_code=response_code,
			response_message=request.POST.get('detail',''),
			customer_name=request.POST.get('customer_name',''),
			customer_email=request.POST.get('customer_email',''),
			transaction_amount=request.POST.get('transaction_amount',0),
			transaction_currency=request.POST.get('transaction_currency',''),
			customer_phone=request.POST.get('customer_phone',''),
			first_4_digits=request.POST.get('first_4_digits',''),
			last_4_digits=request.POST.get('last_4_digits',''),
			card_brand=request.POST.get('card_brand',''),
			trans_date=trans_date,
			pt_token=request.POST.get('response_code',''),
			secure_sign=request.POST.get('response_code',''),
			status=1
			# pt_customer_email=request.POST.get('response_code',''),
			# pt_customer_password=request.POST.get('response_code',''),
		).save()
		print('Success:Transaction {} inserted into database'.format(transaction_id), flush=True)
	else:
		print('Failed! Transaction_id not found')

@csrf_exempt
def paytab_callback(request):
	print('response data is')
	print(request.POST)
	return HttpResponseRedirect('{}/user/promote'.format(settings.SITE_URL))

@csrf_exempt
@api_view(["POST"])
def paytab_createPage(request):
	order_id = request.data.get('o_id')
	plan = AbPlans.objects.get(id=request.data.get('plan'));
	if plan.id == 2:
		# save user selected credits 
		credits_types = ['aircraft','engine','apu']
		price = 0
		abCredits = []
		for credit_type in credits_types:
			qty = request.data.get('{}_qty'.format(credit_type))
			try:
				price += getattr(plan, '{}_value'.format(credit_type)) * qty
			except:
				pass
			abCredits.append(AbCredits(plan=plan, user=request.user, credits_type=credit_type, value=qty))

		AbCredits.objects.bulk_create(abCredits)
		plan.price = price
	
	resposne = createPayTabPage(request, plan, order_id)
	return Response(resposne, status=HTTP_200_OK)

