from rest_framework.urlpatterns import format_suffix_patterns
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from account import views as users_view
from django.conf.urls import url
from info import views as info_views
from item import views as item_views
from connect import views as connect_views


router = DefaultRouter()


u_list = users_view.UserViewSet.as_view({
    'get': 'list',
    'post': 'create',
})
user_detail = users_view.UserViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})
user_plan = users_view.UserViewSet.as_view({
    'get':'plan'
})

contacts_list = connect_views.ContactViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
contact_detail = connect_views.ContactViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

groups_list = users_view.GroupsViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
groups_detail = users_view.GroupsViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

permissions_list = users_view.PermissionsViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
permissions_detail = users_view.PermissionsViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

contenttype_list = users_view.ContentTypeViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
contenttype_detail = users_view.ContentTypeViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})


modal_list = users_view.ModalsViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
modal_detail = users_view.ModalsViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

category_list = info_views.CategoryViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
category_detail = info_views.CategoryViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

manufacturer_list = users_view.ManufacturersViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
manufacturer_detail = users_view.ManufacturersViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

types_list = users_view.TypesViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
types_detail = users_view.TypesViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

configuration_list = info_views.ConfigurationViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
configuration_detail = info_views.ConfigurationViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

condition_list = item_views.ConditionViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
condition_detail = item_views.ConditionViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

release_list = info_views.ReleasesViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
release_detail = info_views.ReleasesViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})


continents_list = connect_views.ContinentsViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
continents_detail = connect_views.ContinentsViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})


regions_list = connect_views.RegionsViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
regions_detail = connect_views.RegionsViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

country_list = connect_views.CountryViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
country_detail = connect_views.CountryViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})


state_list = connect_views.StatesViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
state_detail = connect_views.StatesViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

city_list = connect_views.CityViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
city_detail = connect_views.CityViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

companies_list = connect_views.CompanyViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

companies_detail = connect_views.CompanyViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

speciality_list = connect_views.SpecialityViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

speciality_detail = connect_views.SpecialityViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

titles_list = users_view.TitlesViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

titles_detail = users_view.TitlesViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

aircraft_list = item_views.AircraftViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
aircraft_detail = item_views.AircraftViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

engines_list = item_views.EnginesViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
engines_detail = item_views.EnginesViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

apus_list = item_views.ApusViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
apus_detail = item_views.ApusViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

wanteds_list = item_views.WantedsViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
wanteds_detail = item_views.WantedsViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

parts_list = item_views.PartsViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
parts_detail = item_views.PartsViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

subscribers_list = users_view.SubscriberViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
subscriber_detail = users_view.SubscriberViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

departments_list = connect_views.DepartmentViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
department_detail = connect_views.DepartmentViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})


airports_list = item_views.AirportsViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
airports_detail = item_views.AirportsViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

airfieldTypes_list = item_views.AirfieldTypesViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
airfieldTypes_detail = item_views.AirfieldTypesViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

news_list = info_views.NewsViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
news_detail = info_views.NewsViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

events_list = item_views.EventsViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
events_detail = item_views.EventsViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

emails_list = info_views.EmailsViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
emails_detail = info_views.EmailsViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

cms_list = info_views.CmsViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
cms_detail = info_views.CmsViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

seos_list = info_views.SeoViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
seos_detail = info_views.SeoViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

leads_list = connect_views.LeadsViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
leads_detail = connect_views.LeadsViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

contactqueries_list = connect_views.ContactqueriesViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
contactqueries_detail = connect_views.ContactqueriesViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

paymenthistories_list = info_views.PaymenthistoriesViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
paymenthistories_detail = info_views.PaymenthistoriesViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

medias_list = info_views.MediasViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
medias_detail = info_views.MediasViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

advertisements_list = info_views.AdvertisementsViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
advertisements_detail = info_views.AdvertisementsViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

plans_list = info_views.PlansViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
plans_detail = info_views.PlansViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

points_list = info_views.PointsViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
points_detail = info_views.PointsViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

attaches_list = info_views.AttachesViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
attaches_detail = info_views.AttachesViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

accesslogs_list = users_view.AccesslogsViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
accesslogs_detail = users_view.AccesslogsViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

connections_list = connect_views.LikeViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
connections_detail = connect_views.LikeViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

favourites_list = connect_views.FavouriteViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
favourites_detail = connect_views.FavouriteViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})


# The API URLs are now determined automatically by the router.
urlpatterns = format_suffix_patterns([
    path('', users_view.api_root),
    path('users', u_list, name='users'),
    path('users/plan', user_plan, name='plan_details'),
    path('users/<pk>/', user_detail),   

    path('contacts', contacts_list, name='contacts'),
    path('contacts/<pk>/', contact_detail),

    path('groups', groups_list, name='groups'),
    path('groups/<pk>/', groups_detail),
    path('permissions', permissions_list, name='permissions'),
    path('permissions/<pk>/', permissions_detail),
    path('contenttypes', contenttype_list, name='contenttypes'),
    path('contenttypes/<pk>/', contenttype_detail),

    path('category', category_list, name='category'),
    path('category/<pk>/', category_detail),

    path('manufacturer', manufacturer_list, name='manufacturer'),
    path('manufacturer/<pk>/', manufacturer_detail),

    path('companies', companies_list, name='company'),
    path('companies/<pk>/', companies_detail),

    path('speciality', speciality_list, name='speciality'),
    path('speciality/<pk>/', speciality_detail),

    path('job_titles', titles_list, name='job_titles'),
    path('job_titles/<pk>/', titles_detail),

    path('type', types_list, name='type'),
    path('type/<pk>/', types_detail),

    path('configuration', configuration_list, name='configuration'),
    path('configuration/<pk>/', configuration_detail),

    path('model', modal_list, name='model'),
    path('model/<pk>/', modal_detail),

    path('conditions', condition_list, name='conditions'),
    path('conditions/<pk>/', condition_detail),

    path('releases', release_list, name='releases'),
    path('releases/<pk>/', release_detail),

    path('continent', continents_list, name='continent'),
    path('continent/<pk>/', continents_detail),

    path('region', regions_list, name='region'),
    path('region/<pk>/', regions_detail),

    path('countries', country_list, name='country'),
    path('countries/<pk>/', country_detail),

    path('states', state_list, name='state'),
    path('states/<pk>/', state_detail),

    path('cities', city_list, name='city'),
    path('cities/<pk>/', city_detail),

    path('aircrafts', aircraft_list, name='aircrafts'),
    path('aircrafts/<pk>/', aircraft_detail),

    path('engines', engines_list, name='engines'),
    path('engines/<pk>/', engines_detail),

    path('apus', apus_list, name='apus'),
    path('apus/<pk>/', apus_detail),

    path('parts', parts_list, name='parts'),
    path('parts/<pk>/', parts_detail),

    path('wanteds', wanteds_list, name='wanteds'),
    path('wanteds/<pk>/', wanteds_detail),

    path('subscribers', subscribers_list, name='subscribers'),
    path('subscribers/<pk>/', subscriber_detail),

    path('departments', departments_list, name='departments'),
    path('departments/<pk>/', department_detail),

    path('airports', airports_list, name='airports'),
    path('airport/<pk>/', airports_detail),

    path('airfield', airfieldTypes_list, name='airfield'),
    path('airfield/<pk>/', airfieldTypes_detail),

    path('news', news_list, name='news'),
    path('news/<pk>/', news_detail),

    path('events', events_list, name='events'),
    path('events/<pk>/', events_detail),

    path('emails', emails_list, name='emails'),
    path('emails/<pk>/', emails_detail),

    path('cms', cms_list, name='cms'),# for pages
    path('cms/<pk>/', cms_detail),

    path('seos', seos_list, name='seos'),
    path('seos/<pk>/', seos_detail),

    path('leads', leads_list, name='leads'),
    path('leads/<pk>/', leads_detail),

    path('contactqueries', contactqueries_list, name='contactqueries'),
    path('contactqueries/<pk>/', contactqueries_detail),

    path('paymenthistories', paymenthistories_list, name='paymenthistories'),
    path('paymenthistories/<pk>/', paymenthistories_detail),

    path('medias', medias_list, name='medias'),
    path('medias/<pk>/', medias_detail),

    path('advertisements', advertisements_list, name='advertisements'),
    path('advertisements/<pk>/', advertisements_detail),

    path('plans', plans_list, name='plans'),
    path('plans/<pk>/', plans_detail),

    path('points', points_list, name='points'),
    path('points/<pk>/', points_detail),

    path('attaches', attaches_list, name='attaches'),
    path('attaches/<pk>/', attaches_detail),

    path('accesslogs', accesslogs_list, name='accesslogs'),
    path('accesslogs/<pk>/', accesslogs_detail),

    path('likes', connections_list, name='connections'),
    path('likes/<pk>/', connections_detail),

    path('favourites', favourites_list, name='favourites'),
    path('favourites/<pk>/', favourites_detail),

    path('paytab/createPage', item_views.paytab_createPage, name='paytab_create_page'),
    path('paytab/ipn', item_views.paytab_ipn),

    path('abmodels', info_views.abmodels, name='abmodels'),

    path('assets/update_status', users_view.update_status),
])



