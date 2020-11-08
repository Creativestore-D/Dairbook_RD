import axios from "axios";


// export const API_URL = "http://localhost:8000/api/";
export const API_URL = process.env.REACT_APP_API_URL+'api/';
export const MEDIA_URL = process.env.REACT_APP_API_URL+'static/media/uploads/';
export const LOCAL_STORAGE = 'persist:demo3-auth'

export const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Token '+getToken()
}
export const PERMISSIONS = [
  { value: 1, label: "Create" },
  { value: 2, label: "Edit" },
  { value: 3, label: "Details" },
  { value: 4, label: "Delete" }
];

export const MESSAGE_TYPES = [
  { value: 'user-activation', label: "User activation" },
  { value: 'contact-create', label: "Contact create" },
  { value: 'asset-status', label: "Asset status" },
  { value: 'user-registration', label: "User registration" },
  { value: 'wanted-asset-publish', label: "Wanted asset publish" },
];

export const POSITIONS = [
	{ value: 'Left', label: "Left" },
	{ value: 'Center', label: "Center" },
	{ value: 'Right', label: "Right" },
  ];

export const TIMEZONES = [
  { value: 'GMT-11:00', label: "GMT-11:00" },
  { value: 'GMT-11:30', label: "GMT-11:30" },
  { value: 'GMT-10:00', label: "GMT-10:00" },
  { value: 'GMT-10:30', label: "GMT-10:30" },
  { value: 'GMT-9:00', label: "GMT-9:00" },
  { value: 'GMT-9:30', label: "GMT-9:30" },
  { value: 'GMT-8:00', label: "GMT-8:00" },
  { value: 'GMT-8:30', label: "GMT-8:30" },
  { value: 'GMT-7:00', label: "GMT-7:00" },
  { value: 'GMT-7:30', label: "GMT-7:30" },
  { value: 'GMT-6:00', label: "GMT-6:00" },
  { value: 'GMT-6:30', label: "GMT-6:30" },
  { value: 'GMT-5:00', label: "GMT-5:00" },
  { value: 'GMT-5:30', label: "GMT-5:30" },
  { value: 'GMT-4:00', label: "GMT-4:00" },
  { value: 'GMT-4:30', label: "GMT-4:30" },
  { value: 'GMT-3:00', label: "GMT-3:00" },
  { value: 'GMT-3:30', label: "GMT-3:30" },
  { value: 'GMT-2:00', label: "GMT-2:00" },
  { value: 'GMT-2:30', label: "GMT-2:30" },
  { value: 'GMT-1:00', label: "GMT-1:00" },
  { value: 'GMT-1:30', label: "GMT-1:30" },
  { value: 'GMT 0:00', label: "GMT 0:00" },
  { value: 'GMT+0:30', label: "GMT+0:30" },
  { value: 'GMT+1:00', label: "GMT+1:00" },
  { value: 'GMT+1:30', label: "GMT+1:30" },
  { value: 'GMT+2:00', label: "GMT+2:00" },
  { value: 'GMT+2:30', label: "GMT+2:30" },
  { value: 'GMT+3:00', label: "GMT+3:00" },
  { value: 'GMT+3:30', label: "GMT+3:30" },
  { value: 'GMT+4:00', label: "GMT+4:00" },
  { value: 'GMT+4:30', label: "GMT+4:30" },
  { value: 'GMT+5:00', label: "GMT+5:00" },
  { value: 'GMT+5:30', label: "GMT+5:30" },
  { value: 'GMT+6:00', label: "GMT+6:00" },
  { value: 'GMT+6:30', label: "GMT+6:30" },
  { value: 'GMT+7:00', label: "GMT+7:00" },
  { value: 'GMT+7:30', label: "GMT+7:30" },
  { value: 'GMT+8:00', label: "GMT+8:00" },
  { value: 'GMT+8:30', label: "GMT+8:30" },
  { value: 'GMT+9:00', label: "GMT+9:00" },
  { value: 'GMT+9:30', label: "GMT+9:30" },
  { value: 'GMT+10:00', label: "GMT+10:00" },
  { value: 'GMT+10:30', label: "GMT+10:30" },
  { value: 'GMT+11:00', label: "GMT+11:00" },
  { value: 'GMT+11:30', label: "GMT+11:30" },
];

export function getToken() {
	var token = null;
	if(localStorage.getItem('persist:demo1-auth') != null) {
		token = JSON.parse(localStorage.getItem('persist:demo1-auth')).authToken;
		if(token != undefined)
			var token = token.replace(/['"]+/g, '');
		else
			token = null;
	}
	return token;
}

export function setLocalStorageUser(user) {
	if(localStorage.getItem('persist:demo1-auth') != null) {
		let data = JSON.parse(localStorage.getItem('persist:demo1-auth'));
		data.user = JSON.stringify(user);
		localStorage.setItem('persist:demo1-auth', JSON.stringify(user));
	}
}

export function userHasPermission(permission) {
	if(localStorage.getItem('persist:demo1-auth') != null) {
		let user = JSON.parse(localStorage.getItem('persist:demo1-auth')).user;
		if(user != undefined){
			user = JSON.parse(user);
			if(user.group_name.toLowerCase() == "admin")
				return true;

			if(Array.isArray(permission)){
				for(let i in permission) {
					if(user.permissions.indexOf(permission[i]) > -1)
						return true;
					else if(user.group_permissions.indexOf(permission[i]) > -1) 
						return true;
				}
			} else {
				if(user.permissions.indexOf(permission) > -1)
					return true;
				else if(user.group_permissions.indexOf(permission) > -1) 
					return true;
			}
		}
	}
	return false;
}

export function list(endpoint, params={}) {
	let config = {
	  headers: headers,
	  params: params,
	}
	return axios.get(API_URL+endpoint, config).then(response => {
		if(response.data.results != undefined) {
			// pagination response handling there :)
			response.extra_data = {
				count : response.data.count,
				next : response.data.next,
				previous : response.data.previous,
			}
			response.data = response.data.results;
		}
		return response;
	})
}

export function patch(endpoint, data) {
	let config = {
	  headers: headers,
	}
	return axios.patch(API_URL+endpoint, data, config)
}

export function post(endpoint, data) {
	let config = {
	  headers: headers,
	}
	return axios.post(API_URL+endpoint, data, config)
}

export function del(endpoint, data={}) {
	let config = {
	  headers: headers,
	  data: data,
	}
	return axios.delete(API_URL+endpoint, config)
}
export const PAGES = [
	{label:'Home', value:'1'},
	{label:'Aircraft', value:'2'},
	{label:'Engine', value:'3'},
	{label:'Apu',  value:'4'},
	{label:'Wanted',  value:'5'},
	{label:'Airport',  value:'6'},
	{label:'News',  value:'7'},
	{label:'Event',  value:'8'},
	{label:'Contact',  value:'9'},
	{label:'Company',  value:'10'},
	{label:'Part',  value:'11'},
	{label:'About_Airbook',  value:'12'},
	{label:'Airbook_features',  value:'13'},
	{label:'Help_Support',  value:'14'},
]
export const RELIGIONS = [
	{label:'Islam', value:'Islam'},
	{label:'Judasim', value:'Judasim'},
	{label:'Christianity', value:'Christianity'},
	{label:'Hinduism', value:'Hinduism'},
	{label:'Buddhism', value:'Buddhism'},
	{label:'Sikhism', value:'Sikhism'},
	{label:'Confucianism', value:'Confucianism'},
	{label:'Shinto', value:'Shinto'},
	{label:'Taoism', value:'Taoism'},
	{label:'Other', value:'Other'},
]

export const SECTIONS = [
	{label:'Section One', value:'Section One'},
	{label:'Section Two', value:'Section Two'},
	{label:'Section Three', value:'Section Three'},
	{label:'Section Four', value:'Section Four'},
	{label:'Section Five', value:'Section Five'},
	{label:'Section Six', value:'Section Six'},
	{label:'Section Seven', value:'Section Seven'},
	{label:'Section Eight', value:'Section Eight'},
	{label:'Section Nine', value:'Section Nine'},
	{label:'Section Ten', value:'Section Ten'},
]

export const CONTACT_METHODS = [
	{label:'Email', value:'Email'},
	{label:'Phone', value:'Phone'},
	{label:'Both', value:'Both'},
]

export const GENDERS = [
	{label:'Male', value:'male'},
	{label:'Female', value:'female'},
]

export const TITLES = [
	{label:'Mr', value:'Mr'},
	{label:'Mrs', value:'Mrs'},
	{label:'Ms', value:'Ms'},
]

export const STATUSES = [
	{label:'Pending Approval', value:'Pending Approval'},
	{label:'Approved', value:'Approved'},
	{label:'Revise', value:'Revise'},
	{label:'Rejected', value:'Rejected'},
]

export const ENQUERIES_STATUS = [
	{label:'On hold', value:'on hold'},
	{label:'Solved', value:'solved'},
]

export const AIRCRAFT_STATUSES = [
	{label:'Operational', value:'Operational'},
	{label:'Parking', value:'Parking'},
	{label:'Storage', value:'Storage'},
	{label:'For Tear Down', value:'For Tear Down'},
]

export const AIRCRAFT_COMPLIANCE = [
	{label:'EASA', value:'EASA'},
	{label:'FAA', value:'FAA'},
	{label:'TBA', value:'TBA'},
]

export const AIRCRAFT_OFFER = [
	{label:'Sale', value:'Sale'},
	{label:'ACMI', value:'ACMI'},
	{label:'Dry Lease', value:'Dry Lease'},
	{label:'Wet Lease', value:'Wet Lease'},
	{label:'Lease Purchase', value:'Lease Purchase'},
	{label:'Exchange', value:'Exchange'},
	{label:'Charter', value:'Charter'},
]

export const ENGINE_STATUSES = [
	{label:'New', value:'new'},
	{label:'As removed', value:'as removed'},
	{label:'Overhauled', value:'overhauled'},
	{label:'Serviceable', value:'serviceable'},
	{label:'Repaired', value:'repaired'},
	{label:'Operational', value:'operational'},
	{label:'Storage', value:'storage'},
	{label:'Non serviceable', value:'non serviceable'},
	{label:'Tear down', value:'tear down'},
]

export const ENGINE_OFFER = [
	{label:'Sale', value:'Sale'},
	{label:'Lease', value:'Lease'},
	{label:'Lease Purchase', value:'Lease Purchase'},
	{label:'Exchange', value:'Exchange'},
]

export const UNIT_MEASURES = [
	{label:'EA', value:'EA'},
	{label:'KG', value:'KG'},
	{label:'LBS', value:'LBS'},
	{label:'MM', value:'MM'},
	{label:'CM', value:'CM'},
	{label:'inch', value:'inch'},
	{label:'foot', value:'foot'},
	{label:'liter', value:'liter'},
	{label:'gallon', value:'gallon'},
]

export const ASSETS = [
	{label:'Aircraft', value:'aircraft'},
	{label:'Engine', value:'engine'},
	{label:'Apu', value:'apu'},
	{label:'Parts', value:'parts'},
]

export const AIRCRAFT_TERMS = [
	{label:'ACMI', value:'ACMI'},
	{label:'Dry Lease', value:'Dry Lease'},
	{label:'Charter', value:'Charter'},
	{label:'Lease Purchase', value:'Lease Purchase'},
	{label:'Outright Purchase', value:'Outright Purchase'},
]

export const ENGINE_TERMS = [
	{label:'Outright Purchase', value:'Outright Purchase'},
	{label:'Lease', value:'Lease'},
	{label:'Lease Purchase', value:'Lease Purchase'},
	{label:'Exchange', value:'Exchange'},
	{label:'Part out', value:'Part out'},
]

export const PART_TERMS = [
	{label:'Cash', value:'cash'},
	{label:'Exchange', value:'Exchange'},
]

export const COMMERCIAL_EXTRA_FIELDS =
    [
        {label: 'Owner', value: 'owner'},
        {label: 'Seller', value: 'seller'},
        {label: 'Manager', value: 'manager'},
        {label: 'Current Operator', value: 'current_operator'},
        {label: 'Previous Operator', value: 'previous_operator'}
    ];

export const AIRCRAFT_EXTRA_FIELDS =
    [
        {label: 'Compliance', value: 'compliance'},
        {label: 'TSN', value: 'tsn'},
        {label: 'CSN', value: 'csn'},
        {label: 'MTOW Kg', value: 'mtow'},
        {label: 'MLGW Kg', value: 'mlgw'},
        {label: 'Last C Check', value: 'last_c_check'},
        {label: 'Registration Number', value: 'registration_number'},
        {label: 'Registration Country', value: 'registration_country'},
    ];

export const ENGINE_EXTRA_FIELDS =
    [
        {label: 'TSO', value: 'tso'},
        {label: 'Thrust Rating', value: 'thrust_rating'},
        {label: 'LSV Description', value: 'lsv_description'},
    ];

export const ENGINE_COMMERCIAL_EXTRA_FIELDS =
    [
        {label: 'Owner', value: 'owner'},
        {label: 'Seller', value: 'seller'},
    ];

export const APU_EXTRA_FIELDS =
    [
        {label: 'Thrust Rating', value: 'thrust_rating'},
        {label: 'LSV Description', value: 'lsv_description'},
    ];

export const APU_COMMERCIAL_EXTRA_FIELDS =
    [
        {label: 'Owner', value: 'owner'},
        {label: 'Seller', value: 'seller'},
    ];

export const PARTS_EXTRA_FIELDS =
    [
        {label: 'Release', value: 'release'},
        {label: 'Unit Measure', value: 'unit_measure'},
        {label: 'Price', value: 'price'},
        {label: 'Location', value: 'location'},
        {label: 'Owner', value: 'owner'},
        {label: 'Seller', value: 'seller'},
    ];

export const SUBSCRIPTION_DURATION =
    [
        {label: 'Monthly', value: 'monthly'},
        {label: 'Yearly', value: 'yearly'},
    ];

export const USER_URL = 'user';