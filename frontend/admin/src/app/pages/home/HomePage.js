import React, { Suspense, lazy } from "react";
import { Redirect, Route, Switch, BrowserRouter } from "react-router-dom";
import Builder from "./Builder";
import Dashboard from "./Dashboard";
import DocsPage from "./docs/DocsPage";
import { LayoutSplashScreen } from "../../../_metronic";
import Airbooker from "../security/Airbooker";
import AirfieldList from "../generalSetup/airfieldTypes/List";
import AirfieldCreate from "../generalSetup/airfieldTypes/Create";
import AirfieldDetail from "../generalSetup/airfieldTypes/Detail";
import AirfieldEdit from "../generalSetup/airfieldTypes/Edit";
import Adminuserlist from "../security/adminuser/List";
import Adminuseredit from "../security/adminuser/Edit";
import Adminusercreate from "../security/adminuser/Create";
import Rolepermissionlist from "../security/rolepermission/List";
import Rolepermissionedit from "../security/rolepermission/Edit";
import Accesslog from "../security/Accesslog";
import Settings from "./Settings";
import ConfigurationCreate from "../assets/aircraft/configuration/Create";
import ConfigurationEdit from "../assets/aircraft/configuration/Edit";
import ConfigurationList from "../assets/aircraft/configuration/List";
import ConfigurationDetail from "../assets/aircraft/configuration/Detail";
import CategoryCreate from "../item/category/Create";
import CategoryEdit from "../item/category/Edit";
import CategoryList from "../item/category/List";
import CategoryDetail from "../item/category/Detail";
import QueriesList from "../sales_support/contact_queries/List";
import QueriesDetail from "../sales_support/contact_queries/Detail";
import ManufacturerCreate from "../item/manfacturer/Create";
import ManufacturerEdit from "../item/manfacturer/Edit";
import ManufacturerList from "../item/manfacturer/List";
import ManufacturerDetail from "../item/manfacturer/Detail";
import ModelList from "../item/model/List";
import ModelCreate from "../item/model/Create";
import ModelEdit from "../item/model/Edit";
import ModelDetail from "../item/model/Detail";
import PaymentList from "../sales_support/sales_invoices/List";
import TypeList from "../item/type/List";
import TypeCreate from "../item/type/Create";
import TypeEdit from "../item/type/Edit";
import TypeDetail from "../item/type/Detail";
import SubscribersList from "../../pages/sales_support/subscribers/List";
import SubscribersCreate from "../../pages/sales_support/subscribers/Create";
import SubscribersEdit from "../../pages/sales_support/subscribers/Edit";
import SubscribersDetail from "../../pages/sales_support/subscribers/Detail";
import CitiesList from "../../pages/generalSetup/cities/List";
import CityCreate from "../../pages/generalSetup/cities/Create";
import CityEdit from "../../pages/generalSetup/cities/Edit";
import CityDetail from "../../pages/generalSetup/cities/Detail";
import ContactsList from "../../pages/contacts/List";
import ContactsCreate from "../../pages/contacts/Create";
import ContactsEdit from "../../pages/contacts/Edit";
import ContactsView from "../../pages/contacts/Detail";
import CompaniesList from "../../pages/companies/List";
import CompaniesCreate from "../../pages/companies/Create";
import CompaniesEdit from "../../pages/companies/Edit";
import CompaniesDetail from "../../pages/companies/Detail";
import ContinentList from "../../pages/generalSetup/continent/List";
import ContinentCreate from "../../pages/generalSetup/continent/Create";
import ContinentEdit from "../../pages/generalSetup/continent/Edit";
import ContinentDetail from "../../pages/generalSetup/continent/Detail";
import CountryList from "../../pages/generalSetup/countries/List";
import CountryCreate from "../../pages/generalSetup/countries/Create";
import CountryEdit from "../../pages/generalSetup/countries/Edit";
import CountryDetail from "../../pages/generalSetup/countries/Detail";
import CMSList from "../settings/static_pages/List";
import CMSCreate from "../settings/static_pages/Create";
import CMSEdit from "../settings/static_pages/Edit";
import CMSDetail from "../settings/static_pages/Detail";
import EventsList from "../events/List";
import EventCreate from "../events/Create";
import EventEdit from "../events/Edit";
import EventDetail from "../events/Detail";
import NewsList from "../news/List";
import NewsCreate from "../news/Create";
import NewsEdit from "../news/Edit";
import NewsDetail from "../news/Detail";
import PartsConditionList from "../parts/condition/List";
import PartsConditionCreate from "../parts/condition/Create";
import PartsConditionEdit from "../parts/condition/Edit";
import PartsConditionDetail from "../parts/condition/Detail";
import PartsReleasesList from "../parts/releases/List";
import PartsReleasesCreate from "../parts/releases/Create";
import PartsReleasesEdit from "../parts/releases/Edit";
import PartsReleasesDetail from "../parts/releases/Detail";
import RegionList from "../../pages/generalSetup/regions/List";
import RegionCreate from "../../pages/generalSetup/regions/Create";
import RegionEdit from "../../pages/generalSetup/regions/Edit";
import RegionDetail from "../../pages/generalSetup/regions/Detail";
import SEOList from "../settings/seo/List";
import SEOCreate from "../settings/seo/Create";
import SEOEdit from "../settings/seo/Edit";
import SEODetail from "../settings/seo/Detail";
import SpecialtiesList from "../../pages/generalSetup/specialties/List";
import SpecialityCreate from "../../pages/generalSetup/specialties/Create";
import SpecialityEdit from "../../pages/generalSetup/specialties/Edit";
import SpecialityDetail from "../../pages/generalSetup/specialties/Detail";
import StateList from "../../pages/generalSetup/states/List";
import StateCreate from "../../pages/generalSetup/states/Create";
import StateEdit from "../../pages/generalSetup/states/Edit";
import StateDetail from "../../pages/generalSetup/states/Detail";
import TitlesList from "../../pages/generalSetup/jobTitles/List";
import TitleCreate from "../../pages/generalSetup/jobTitles/Create";
import TitleEdit from "../../pages/generalSetup/jobTitles/Edit";
import TitleDetail from "../../pages/generalSetup/jobTitles/Detail";
import Userpermission from "../security/adminuser/Userpermission";
import Rolecreate from "../security/rolepermission/Create";
import { userHasPermission } from "../../crud/api";
import Permissiondenied from "../errors/Permissiondenied";
import AircraftAssetsList from "../assets/aircraft/List";
import AircraftAssetsEdit from "../assets/aircraft/Edit";
import AircraftAssetsCreate from "../assets/aircraft/Create";
import AircraftAssetsDetail from "../assets/aircraft/Detail";
import EngineAssetsList from "../assets/engine/List";
import EngineAssetsEdit from "../assets/engine/Edit";
import EngineAssetsCreate from "../assets/engine/Create";
import EngineAssetsDetail from "../assets/engine/Detail";
import AirportsList from "../airports/List";
import AirportCreate from "../airports/Create";
import AirportEdit from "../airports/Edit";
import AirportDetail from "../airports/Detail";
import ApuAssetsList from "../assets/apu/List";
import ApuAssetsEdit from "../assets/apu/Edit";
import ApuAssetsCreate from "../assets/apu/Create";
import ApuAssetsDetail from "../assets/apu/Detail";
import EmailTemplateList from "../generalSetup/email-templates/List";
import EmailTemplateCreate from "../generalSetup/email-templates/Create";
import EmailTemplateEdit from "../generalSetup/email-templates/Edit";
import EmailTemplateDetail from "../generalSetup/email-templates/Detail";
import PlansList from "../../pages/sales_support/plans/Edit";
import PlansCreate from "../../pages/sales_support/plans/Create";
import PlansEdit from "../../pages/sales_support/plans/Edit";
import PlansDetail from "../../pages/sales_support/plans/Detail";
import PartAssetsList from "../assets/parts/List";
import PartAssetsEdit from "../assets/parts/Edit";
import PartAssetsCreate from "../assets/parts/Create";
import PartAssetsDetail from "../assets/parts/Detail";
import WantedAssetsList from "../assets/wanted/List";
import WantedAssetsEdit from "../assets/wanted/Edit";
import WantedAssetsCreate from "../assets/wanted/Create";
import WantedAssetsDetail from "../assets/wanted/Detail";
import LeadList from "../lead/List";
import AdvertsList from "../adverts/List";
import AdvertsCreate from "../adverts/Create";
import AdvertsEdit from "../adverts/Edit";
import AdvertsDetail from "../adverts/Detail";
import MediaGallery from "../../library/MediaGallery";
import * as routerHelpers from "../../router/RouterHelpers";


const GoogleMaterialPage = lazy(() =>
  import("./google-material/GoogleMaterialPage")
);
const ReactBootstrapPage = lazy(() =>
  import("./react-bootstrap/ReactBootstrapPage")
);
export default function HomePage(props) {
    let extra_data = props.extra_data;
    extra_data.page_type = null;
    extra_data.lastPath = routerHelpers.getLastLocation();
    props.setExtraData(extra_data);
    console.log(props);
    
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from root URL to /dashboard. */
          <Redirect exact from="/admin" to="/admin/dashboard" />
        }
        <Route path="/admin/builder" component={Builder} />
        <Route path="/admin/dashboard" component={Dashboard} />
        <Route path="/admin/google-material" component={GoogleMaterialPage} />
        <Route path="/admin/react-bootstrap" component={ReactBootstrapPage} />
        <Route path="/admin/docs" component={DocsPage} />

        {/*Admin user Routes*/}
        <Route 
            exact path="/admin/airbookers" 
            render={(routeProps) => { return userHasPermission(['add_abusers','view_abusers']) ? <Airbooker {...routeProps} setExtraData={props.setExtraData}  extra_data={props.extra_data} /> : <Permissiondenied/>}}
        />
        <Route exact path="/admin/airbookers/:user_id/permissions" component={userHasPermission('change_abpermissions') ? Userpermission : Permissiondenied} />

        {/*Admin user Routes*/}
        <Route 
            exact path="/admin/admin-user" 
            render={(routeProps) => { return userHasPermission(['add_abusers','view_abusers']) ? <Adminuserlist {...routeProps} setExtraData={props.setExtraData}  extra_data={props.extra_data} /> : <Permissiondenied/>}}
        />
        <Route exact path="/admin/admin-user/:user_id/permissions" component={userHasPermission('change_abpermissions') ? Userpermission : Permissiondenied} />
        <Route path="/admin/admin-user/create" component={userHasPermission('add_abusers') ? Adminusercreate : Permissiondenied} />
        <Route exact path="/admin/admin-user/:user_id/edit" component={userHasPermission('change_abusers') ? Adminuseredit : Permissiondenied} />

        <Route path="/admin/role-permission/:group_id/edit" component={userHasPermission('change_group') ? Rolepermissionedit : Permissiondenied} />
        <Route path="/admin/role-permission/create" component={userHasPermission('add_group') ? Rolecreate : Permissiondenied} />
        <Route path="/admin/role-permission" component={Rolepermissionlist} />

        {/*Accesslogs Routes*/}
        <Route 
            exact path="/admin/accesslogs" 
            render={(routeProps) => { return userHasPermission(['add_abaccesslogs','view_abaccesslogs']) ? <Accesslog {...routeProps} setExtraData={props.setExtraData}  extra_data={props.extra_data} /> : <Permissiondenied/>}}
        />

        {/*Airfield Types Routes*/}
        <Route 
            exact path="/admin/airfield" 
            render={(routeProps) => { return userHasPermission(['add_abairfieldtypes','view_abairfieldtypes']) ? <AirfieldList {...routeProps} setExtraData={props.setExtraData}  extra_data={props.extra_data} /> : <Permissiondenied/>}}
        />
        <Route exact path="/admin/airfield/create" component={userHasPermission('add_abairfieldtypes') ? AirfieldCreate : Permissiondenied} />
        <Route path="/admin/airfield/:airfield_id/edit" component={userHasPermission('change_abairfieldtypes') ? AirfieldEdit : Permissiondenied} />
        <Route path="/admin/airfield/:airfield_id" component={userHasPermission('view_abairfieldtypes') ? AirfieldDetail : Permissiondenied} />
        
        {/*Aircraft Configuration Routes*/}
        <Route 
            exact path="/admin/aircraft/configuration" 
            render={(routeProps) => { return userHasPermission(['add_abconfigurations','view_abconfigurations']) ? <ConfigurationList {...routeProps} setExtraData={props.setExtraData}  extra_data={props.extra_data} /> : <Permissiondenied/>}}
        />
        <Route path="/admin/aircraft/configuration/create" component={userHasPermission('add_abconfigurations') ? ConfigurationCreate : Permissiondenied} />
        <Route path="/admin/aircraft/configuration/:configuration_id/edit" component={userHasPermission('change_abconfigurations') ? ConfigurationEdit : Permissiondenied} />
        <Route path="/admin/aircraft/configuration/:configuration_id" component={userHasPermission('view_abconfigurations') ? ConfigurationDetail : Permissiondenied} />
        
        {/*Subscriber Routes*/}
        <Route 
            exact path="/admin/subscriber" 
            render={(routeProps) => { return userHasPermission(['add_absubscribers','view_absubscribers']) ? <SubscribersList {...routeProps} setExtraData={props.setExtraData}  extra_data={props.extra_data} /> : <Permissiondenied/>}}
        />
        <Route path="/admin/subscriber/create" component={userHasPermission('add_absubscribers') ? SubscribersCreate : Permissiondenied} />
        <Route path="/admin/subscriber/:subscriber_id/edit" component={userHasPermission('change_absubscribers') ? SubscribersEdit : Permissiondenied} />
        <Route path="/admin/subscriber/:subscriber_id" component={userHasPermission('view_absubscribers') ? SubscribersDetail : Permissiondenied} />
                
        {/*Contacts  Routes*/}
        <Route 
            exact path="/admin/contacts" 
            render={(routeProps) => { return userHasPermission(['add_abcontacts','view_abcontacts']) ? <ContactsList {...routeProps} setExtraData={props.setExtraData}  extra_data={props.extra_data} /> : <Permissiondenied/>}}
        />
        <Route path="/admin/contacts/create" component={userHasPermission('add_abcontacts') ? ContactsCreate : Permissiondenied} />
        <Route path="/admin/contacts/:contact_id/edit" component={userHasPermission('change_abcontacts') ? ContactsEdit : Permissiondenied} />
        <Route path="/admin/contacts/:contact_id" component={userHasPermission('view_abcontacts') ? ContactsView : Permissiondenied} />
                
        {/*Parts Condition Routes*/}
        <Route 
            exact path="/admin/parts/condition" 
            render={(routeProps) => { return userHasPermission(['add_abconditions','view_abconditions']) ? <PartsConditionList {...routeProps} setExtraData={props.setExtraData}  extra_data={props.extra_data} /> : <Permissiondenied/>}}
        />
        <Route path="/admin/parts/condition/create" component={userHasPermission('add_abconditions') ? PartsConditionCreate : Permissiondenied} />
        <Route path="/admin/parts/condition/:condition_id/edit" component={userHasPermission('change_abconditions') ? PartsConditionEdit : Permissiondenied} />
        <Route path="/admin/parts/condition/:condition_id" component={userHasPermission('view_abconditions') ? PartsConditionDetail : Permissiondenied} />

        {/*Cities Routes*/}
        <Route 
            exact path="/admin/cities" 
            render={(routeProps) => { return userHasPermission(['add_abcities','view_abcities']) ? <CitiesList {...routeProps} setExtraData={props.setExtraData}  extra_data={props.extra_data} /> : <Permissiondenied/>}}
        />
        <Route path="/admin/cities/create" component={userHasPermission('add_abcities') ? CityCreate : Permissiondenied} />
        <Route path="/admin/cities/:city_id/edit" component={userHasPermission('change_abcities') ? CityEdit : Permissiondenied} />
        <Route path="/admin/cities/:city_id" component={userHasPermission('view_abcities') ? CityDetail : Permissiondenied} />

        {/* Companies Route*/}
        <Route 
            exact path="/admin/companies" 
            render={(routeProps) => { return userHasPermission(['add_abcompanies','view_abcompanies']) ? <CompaniesList {...routeProps} setExtraData={props.setExtraData}  extra_data={props.extra_data} /> : <Permissiondenied/>}}
        />
        <Route exact path="/admin/companies/create" component={userHasPermission('add_abcompanies') ? CompaniesCreate : Permissiondenied} />
        <Route exact path="/admin/companies/:company_id/edit" component={userHasPermission('change_abcompanies') ? CompaniesEdit : Permissiondenied} />
        <Route exact path="/admin/companies/:company_id" component={userHasPermission('view_abcompanies') ? CompaniesDetail : Permissiondenied} />
        
        {/*Continents Routes*/}
        <Route 
            exact path="/admin/continent" 
            render={(routeProps) => { return userHasPermission(['add_abcontinents','view_abcontinents']) ? <ContinentList {...routeProps} setExtraData={props.setExtraData}  extra_data={props.extra_data} /> : <Permissiondenied/>}}
        />
        <Route path="/admin/continent/create" component={userHasPermission('add_abcontinents') ? ContinentCreate : Permissiondenied} />
        <Route path="/admin/continent/:continent_id/edit" component={userHasPermission('change_abcontinents') ? ContinentEdit : Permissiondenied} />
        <Route path="/admin/continent/:continent_id" component={userHasPermission('view_abcontinents') ? ContinentDetail : Permissiondenied} />

        {/*Contact Queries Routes*/}
        <Route 
            exact path="/admin/contactqueries" 
            render={(routeProps) => { return userHasPermission(['add_abcontactqueries','view_abcontactqueries']) ? <QueriesList {...routeProps} setExtraData={props.setExtraData}  extra_data={props.extra_data} /> : <Permissiondenied/>}}
        />
        <Route path="/admin/contactqueries/:query_id" component={userHasPermission('view_abcontactqueries') ? QueriesDetail : Permissiondenied} />

        {/*States Routes*/}
        <Route 
            exact path="/admin/countries" 
            render={(routeProps) => { return userHasPermission(['add_abcountries','view_abcountries']) ? <CountryList {...routeProps} setExtraData={props.setExtraData}  extra_data={props.extra_data} /> : <Permissiondenied/>}}
        />
        <Route path="/admin/countries/create" component={userHasPermission('add_abcountries') ? CountryCreate : Permissiondenied} />
        <Route path="/admin/countries/:country_id/edit" component={userHasPermission('change_abcountries') ? CountryEdit : Permissiondenied} />
        <Route path="/admin/countries/:country_id" component={userHasPermission('view_abcountries') ? CountryDetail : Permissiondenied} />
        
        {/*Cms Routes*/}
        <Route 
            exact path="/admin/cms" 
            render={(routeProps) => { return userHasPermission(['add_abcms','view_abcms']) ? <CMSList {...routeProps} setExtraData={props.setExtraData}  extra_data={props.extra_data} /> : <Permissiondenied/>}}
        />
        <Route path="/admin/cms/create" component={userHasPermission('add_abcms') ? CMSCreate : Permissiondenied} />
        <Route path="/admin/cms/:cms_id/edit" component={userHasPermission('change_abcms') ? CMSEdit : Permissiondenied} />
        <Route path="/admin/cms/:cms_id" component={userHasPermission('view_abcms') ? CMSDetail : Permissiondenied} />

        <Route exact path="/admin/plans" component={PlansList} />
        <Route exact path="/admin/plans/create" component={userHasPermission('add_abplans') ? PlansCreate : Permissiondenied} />
        <Route exact path="/admin/plans/:plan_id/edit" component={userHasPermission('change_abplans') ? PlansEdit : Permissiondenied} />
        <Route exact path="/admin/plans/:plan_id" component={userHasPermission('view_abplans') ? PlansDetail : Permissiondenied} />

        {/*Parts Release Routes*/}
        <Route 
            exact path="/admin/parts/release" 
            render={(routeProps) => { return userHasPermission(['add_abreleases','view_abreleases']) ? <PartsReleasesList {...routeProps} setExtraData={props.setExtraData}  extra_data={props.extra_data} /> : <Permissiondenied/>}}
        />
        <Route path="/admin/parts/release/create" component={userHasPermission('add_abreleases') ? PartsReleasesCreate : Permissiondenied} />
        <Route path="/admin/parts/release/:release_id/edit" component={userHasPermission('change_abreleases') ? PartsReleasesEdit : Permissiondenied} />
        <Route path="/admin/parts/release/:release_id" component={userHasPermission('view_abreleases') ? PartsReleasesDetail : Permissiondenied} />

        {/*Regions Routes*/}
        <Route 
            exact path="/admin/region" 
            render={(routeProps) => { return userHasPermission(['add_abregions','view_abregions']) ? <RegionList {...routeProps} setExtraData={props.setExtraData}  extra_data={props.extra_data} /> : <Permissiondenied/>}}
        />
        <Route path="/admin/region/create" component={userHasPermission('add_abregions') ? RegionCreate : Permissiondenied} />
        <Route path="/admin/region/:region_id/edit" component={userHasPermission('change_abregions') ? RegionEdit : Permissiondenied} />
        <Route path="/admin/region/:region_id" component={userHasPermission('view_abregions') ? RegionDetail : Permissiondenied} />

        <Route exact path="/admin/invoices" component={PaymentList} />

        {/*Seos Routes*/}
        <Route 
            exact path="/admin/seos" 
            render={(routeProps) => { return userHasPermission(['add_abseos','view_abseos']) ? <SEOList {...routeProps} setExtraData={props.setExtraData}  extra_data={props.extra_data} /> : <Permissiondenied/>}}
        />
        <Route path="/admin/seos/create" component={userHasPermission('add_abseos') ? SEOCreate : Permissiondenied} />
        <Route path="/admin/seos/:seo_id/edit" component={userHasPermission('change_abseos') ? SEOEdit : Permissiondenied} />
        <Route path="/admin/seos/:seo_id" component={userHasPermission('view_abseos') ? SEODetail : Permissiondenied} />
        
        {/*Speciality Routes*/}
        <Route 
            exact path="/admin/speciality" 
            render={(routeProps) => { return userHasPermission(['add_abspecialities','view_abspecialities']) ? <SpecialtiesList {...routeProps} setExtraData={props.setExtraData}  extra_data={props.extra_data} /> : <Permissiondenied/>}}
        />
        <Route path="/admin/speciality/create" component={userHasPermission('add_abspecialities') ? SpecialityCreate : Permissiondenied} />
        <Route path="/admin/speciality/:speciality_id/edit" component={userHasPermission('change_abspecialities') ? SpecialityEdit : Permissiondenied} />
        <Route path="/admin/speciality/:speciality_id" component={userHasPermission('view_abspecialities') ? SpecialityDetail : Permissiondenied} />

        {/*States Routes*/}
        <Route 
            exact path="/admin/states" 
            render={(routeProps) => { return userHasPermission(['add_abstates','view_abstates']) ? <StateList {...routeProps} setExtraData={props.setExtraData}  extra_data={props.extra_data} /> : <Permissiondenied/>}}
        />
        <Route path="/admin/states/create" component={userHasPermission('add_abstates') ? StateCreate : Permissiondenied} />
        <Route path="/admin/states/:state_id/edit" component={userHasPermission('change_abstates') ? StateEdit : Permissiondenied} />
        <Route path="/admin/states/:state_id" component={userHasPermission('view_abstates') ? StateDetail : Permissiondenied} />

        {/*Job Titles Routes*/}
        <Route 
            exact path="/admin/titles" 
            render={(routeProps) => { return userHasPermission(['add_abtitles','view_abtitles']) ? <TitlesList {...routeProps} setExtraData={props.setExtraData}  extra_data={props.extra_data} /> : <Permissiondenied/>}}
        />
        <Route path="/admin/titles/create" component={userHasPermission('add_abtitles') ? TitleCreate : Permissiondenied} />
        <Route path="/admin/titles/:title_id/edit" component={userHasPermission('change_abtitles') ? TitleEdit : Permissiondenied} />
        <Route path="/admin/titles/:title_id" component={userHasPermission('view_abtitles') ? TitleDetail : Permissiondenied} />
        
        <Route exact path="/admin/:type/category/create" component={userHasPermission('add_abcategories') ? CategoryCreate : Permissiondenied} />
        <Route exact path="/admin/:type/category/:category_id/edit" component={userHasPermission('change_abcategories') ? CategoryEdit : Permissiondenied} />
        <Route exact path="/admin/:type/category/:category_id" component={userHasPermission('view_abcategories') ? CategoryDetail : Permissiondenied} />

        <Route path="/admin/:type/manufacturer/:manufacturer_id/edit" component={userHasPermission('change_abmanufacturers') ? ManufacturerEdit : Permissiondenied} />
        <Route path="/admin/:type/manufacturer/create" component={userHasPermission('add_abmanufacturers') ? ManufacturerCreate : Permissiondenied} />
        <Route path="/admin/:type/manufacturer/:manufacturer_id" component={userHasPermission('view_abmanufacturers') ? ManufacturerDetail : Permissiondenied} />
        
        <Route path="/admin/:type/model/:model_id/edit" component={ModelEdit} />
        <Route path="/admin/:type/model/create" component={userHasPermission('add_abmodels') ? ModelCreate : Permissiondenied} />
        <Route path="/admin/:type/model/:model_id" component={userHasPermission('view_abmodels') ? ModelDetail : Permissiondenied} />

        <Route path="/admin/:type/type/:type_id/edit" component={userHasPermission('change_abtypes') ? TypeEdit : Permissiondenied} />
        <Route 
            path="/admin/:type/type/create" 
            render={(routeProps) => { return userHasPermission(['add_abtypes']) ? <TypeCreate {...routeProps} setExtraData={props.setExtraData} extra_data={props.extra_data} /> : <Permissiondenied/>}}
        />
        <Route path="/admin/:type/type/:type_id" component={userHasPermission('view_abtypes') ? TypeDetail : Permissiondenied} />

        <Route exact 
            path="/admin/:type/category" 
            render={(routeProps) => { return userHasPermission(['add_abcategories','view_abcategories']) ? <CategoryList {...routeProps} setExtraData={props.setExtraData}  extra_data={props.extra_data} /> : <Permissiondenied/>}}
        />

        <Route 
            path="/admin/:type/manufacturer" 
            render={(routeProps) => { return userHasPermission(['add_abmanufacturers','view_abmanufacturers']) ? <ManufacturerList {...routeProps} setExtraData={props.setExtraData}  extra_data={props.extra_data} /> : <Permissiondenied/>}}
        />
        
        <Route 
            path="/admin/:type/type" 
            render={(routeProps) => { return userHasPermission(['add_abtypes','view_abtypes']) ? <TypeList {...routeProps} setExtraData={props.setExtraData}  extra_data={props.extra_data} /> : <Permissiondenied/>}}
        />
        <Route 
            path="/admin/:type/model" 
            render={(routeProps) => { return userHasPermission(['add_abmodels','view_abmodels']) ? <ModelList {...routeProps} setExtraData={props.setExtraData}  extra_data={props.extra_data} /> : <Permissiondenied/>}}
        />

        {/* News Route*/}
        <Route 
            exact path="/admin/news" 
            render={(routeProps) => { return userHasPermission(['add_abnews','view_abnews']) ? <NewsList {...routeProps} setExtraData={props.setExtraData}  extra_data={props.extra_data} /> : <Permissiondenied/>}}
        />
        <Route path="/admin/news/create" component={userHasPermission('add_abnews') ? NewsCreate : Permissiondenied} />
        <Route path="/admin/news/:news_id/edit" component={userHasPermission('change_abnews') ? NewsEdit : Permissiondenied} />
        <Route exact path="/admin/news/:news_id" component={userHasPermission('view_abnews') ? NewsDetail : Permissiondenied} />

        {/* Events Route*/}
        <Route 
            exact path="/admin/events" 
            render={(routeProps) => { return userHasPermission(['add_abevents','view_abevents']) ? <EventsList {...routeProps} setExtraData={props.setExtraData}  extra_data={props.extra_data} /> : <Permissiondenied/>}}
        />
        <Route path="/admin/events/create" component={userHasPermission('add_abevents') ? EventCreate : Permissiondenied} />
        <Route path="/admin/events/:event_id/edit" component={userHasPermission('change_abevents') ? EventEdit : Permissiondenied} />
        <Route exact path="/admin/events/:event_id" component={userHasPermission('view_abevents') ? EventDetail : Permissiondenied} />

        {/*Assets Aircraft Routes*/}
        <Route 
            exact path="/admin/aircraft/asset" 
            render={(routeProps) => { return userHasPermission(['add_abaircrafts','view_abaircrafts']) ? <AircraftAssetsList {...routeProps} setExtraData={props.setExtraData}  extra_data={props.extra_data} /> : <Permissiondenied/>}}
        />
        <Route path="/admin/aircraft/asset/create" component={userHasPermission('add_abaircrafts') ? AircraftAssetsCreate : Permissiondenied} />
        <Route path="/admin/aircraft/asset/:aircraft_id/edit" component={userHasPermission('change_abaircrafts') ? AircraftAssetsEdit : Permissiondenied} />
        <Route path="/admin/aircraft/asset/:aircraft_id" component={userHasPermission('view_abaircrafts') ? AircraftAssetsDetail : Permissiondenied} />

        <Route path="/admin/settings" component={Settings} />

        {/*Airports Routes*/}
        <Route 
            exact path="/admin/airport" 
            render={(routeProps) => { return userHasPermission(['add_abairports','view_abairports']) ? <AirportsList {...routeProps} setExtraData={props.setExtraData}  extra_data={props.extra_data} /> : <Permissiondenied/>}}
        />
        <Route exact path="/admin/airport/create" render={(routeProps) => <AirportCreate {...routeProps} userProp={props.user} />} />
        <Route exact path="/admin/airport/:airport_id/edit" component={AirportEdit} />
        <Route exact path="/admin/airport/:airport_id" component={AirportDetail} />

        {/*Assets Engine Routes*/}
        <Route 
            exact path="/admin/engine/asset" 
            render={(routeProps) => { return userHasPermission(['add_abengines','view_abengines']) ? <EngineAssetsList {...routeProps} setExtraData={props.setExtraData}  extra_data={props.extra_data} /> : <Permissiondenied/>}}
        />
        <Route path="/admin/engine/asset/create" component={userHasPermission('add_abengines') ? EngineAssetsCreate : Permissiondenied} />
        <Route path="/admin/engine/asset/:engine_id/edit" component={userHasPermission('change_abengines') ? EngineAssetsEdit : Permissiondenied} />
        <Route path="/admin/engine/asset/:engine_id" component={userHasPermission('view_abengines') ? EngineAssetsDetail : Permissiondenied} />

        {/*Assets Apu Routes*/}
        <Route 
            exact path="/admin/apu/asset" 
            render={(routeProps) => { return userHasPermission(['add_abapus','view_abapus']) ? <ApuAssetsList {...routeProps} setExtraData={props.setExtraData}  extra_data={props.extra_data} /> : <Permissiondenied/>}}
        />
        <Route path="/admin/apu/asset/create" component={userHasPermission('add_abapus') ? ApuAssetsCreate : Permissiondenied} />
        <Route path="/admin/apu/asset/:apu_id/edit" component={userHasPermission('change_abapus') ? ApuAssetsEdit : Permissiondenied} />
        <Route path="/admin/apu/asset/:apu_id" component={userHasPermission('view_abapus') ? ApuAssetsDetail : Permissiondenied} />

        {/*Assets Parts Routes*/}
        <Route 
            exact path="/admin/part/asset" 
            render={(routeProps) => { return userHasPermission(['add_abparts','view_abparts']) ? <PartAssetsList {...routeProps} setExtraData={props.setExtraData}  extra_data={props.extra_data} /> : <Permissiondenied/>}}
        />
        <Route path="/admin/part/asset/create" component={userHasPermission('add_abparts') ? PartAssetsCreate : Permissiondenied} />
        <Route path="/admin/part/asset/:part_id/edit" component={userHasPermission('change_abparts') ? PartAssetsEdit : Permissiondenied} />
        <Route path="/admin/part/asset/:part_id" component={userHasPermission('view_abparts') ? PartAssetsDetail : Permissiondenied} />

        {/*Assets Wanted Routes*/}
        <Route 
            exact path="/admin/wanted/asset" 
            render={(routeProps) => { return userHasPermission(['add_abwanteds','view_abwanteds']) ? <WantedAssetsList {...routeProps} setExtraData={props.setExtraData}  extra_data={props.extra_data} /> : <Permissiondenied/>}}
        />
        <Route path="/admin/wanted/asset/create" component={userHasPermission('add_abwanteds') ? WantedAssetsCreate : Permissiondenied} />
        <Route path="/admin/wanted/asset/:wanted_id/edit" component={userHasPermission('change_abwanteds') ? WantedAssetsEdit : Permissiondenied} />
        <Route path="/admin/wanted/asset/:wanted_id" component={userHasPermission('view_abwanteds') ? WantedAssetsDetail : Permissiondenied} />

        {/*Email Template Routes*/}
        <Route 
            exact path="/admin/email-template" 
            render={(routeProps) => { return userHasPermission(['add_abcannedemails','view_abcannedemails']) ? <EmailTemplateList {...routeProps} setExtraData={props.setExtraData}  extra_data={props.extra_data} /> : <Permissiondenied/>}}
        />
        <Route exact path="/admin/email-template/create" component={EmailTemplateCreate} />
        <Route exact path="/admin/email-template/:template_id/edit" component={EmailTemplateEdit} />
        <Route exact path="/admin/email-template/:template_id" component={EmailTemplateDetail} />

        {/*Leads Routes*/}
        <Route 
            exact path="/admin/lead" 
            render={(routeProps) => { return userHasPermission(['add_ableads','view_ableads']) ? <LeadList {...routeProps} setExtraData={props.setExtraData}  extra_data={props.extra_data} /> : <Permissiondenied/>}}
        />

        {/*Adverts Routes*/}
        <Route 
            exact path="/admin/adverts" 
            render={(routeProps) => { return userHasPermission(['add_abadvertisements','view_abadvertisements']) ? <AdvertsList {...routeProps} setExtraData={props.setExtraData}  extra_data={props.extra_data} /> : <Permissiondenied/>}}
        />
        <Route exact path="/admin/adverts/create" component={AdvertsCreate} />
        <Route exact path="/admin/adverts/:advert_id/edit" component={AdvertsEdit} />
        <Route exact path="/admin/adverts/:advert_id" component={AdvertsDetail} />

        <Route exact path="/admin/media" component={MediaGallery} />

        <Redirect to="/admin/error/error-v1" />
      </Switch>
    </Suspense>
  );
}
