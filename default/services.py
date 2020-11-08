from info.models import AbPlans
import requests, json
from django.conf import settings
from itertools import chain

def getPlanNameAndType(user):
	plans = AbPlans.objects.all()
	plan = plan_type = None
	if user.order_id == '101':
		plan = plans[1]
		plan_type = 'monthly'

	elif user.order_id == '102':
		plan = plans[1]
		plan_type = 'yearly'

	elif user.order_id == '201':
		plan = plans[2]
		plan_type = 'monthly'

	elif user.order_id == '202':
		plan = plans[2]
		plan_type = 'yearly'

	return {'plan':plan, 'type': plan_type }


def makeRequestDict(obj):
	items = {}
	for k in obj:
		# control request attributes from here
		if k in ['REMOTE_ADDR','REQUEST_METHOD']:
			items[k] = obj[k]

	if 'HTTP_X_FORWARDED_FOR' in obj:
		obj["HTTP_X_PROXY_REMOTE_ADDR"] = obj["REMOTE_ADDR"]
		parts = obj["HTTP_X_FORWARDED_FOR"].split(",", 1)
		items["REMOTE_ADDR"] = parts[0]
	return items

def to_dict(instance):
    opts = instance._meta
    data = {}
    for f in chain(opts.concrete_fields, opts.private_fields):
        data[f.name] = f.value_from_object(instance)
    for f in opts.many_to_many:
        data[f.name] = [i.id for i in f.value_from_object(instance)]
    return data
    
def createPayTabPage(request, plan, order_id):
	user = request.user
	if not user:
		return {"success":False}

	user.order_id = order_id
	contact = user.contact.first()
	
	if order_id in ['102', '202']: # yearly subscription
		quantity = 12
	else:
		quantity = 1

	amount = quantity * plan.price

	requestMeta = makeRequestDict(request.META)

	data = {
		'merchant_email':'arslanmehmood051@gmail.com',
		'secret_key':'G5i3Gbq9dI4117OSLsnJeMshwuOK6VgM0yQGJgQXZUZ01NTMfgwu2YMztBkzwAmw8cdSt3QsXPtYDmLTChnFgafJLzjh9GNiT0bm',
		'currency':'USD',#change this to the required currency
		'amount':amount,#change this to the required amount
		'site_url':settings.SITE_URL,#change this to reflect your site
		'title':'Billing for purchasing plan '+plan.title,#Change this to reflect your order title
		'quantity':quantity,#Quantity of the product
		'unit_price':plan.price, #Quantity * price must be equal to amount
		'products_per_title':plan.title, #Change this to your products
		'return_url':'{}/paytab/callback'.format(settings.SITE_URL),#This should be your callback url
		'cc_first_name':contact.first_name if contact else '',#Customer First Name
		'cc_last_name':contact.last_name if contact else '',#Customer Last Name
		'cc_phone_number':'00971', #Country code
		'phone_number':contact.mobile_phone if contact and contact.mobile_phone else 'Not provided', #Customer Phone Minimum 6 numbers and Maximum 15
		'billing_address':contact.address if contact and contact.address else 'Not provided', #Billing Address max-legnth 40
		'city':contact.city.name if contact and contact.city else'Not provided',#Billing City max-legnth 50
		'state':contact.state.name if contact  and contact.state else 'Not provided',#Billing State
		'postal_code':'Not provided',#
		'country':'BHR',#Iso 3 country code
		'email':user.email,#Customer Email
		'ip_customer':requestMeta['REMOTE_ADDR'],#Pass customer IP here
		'ip_merchant':'127.0.0.1',#Change this to your server IP
		'address_shipping':contact.address if contact and contact.address else 'Not provided',#Shipping Address
		'city_shipping':contact.city.name if contact and contact.city else 'Not provided',#Shipping City
		'state_shipping':contact.state.name if contact and contact.state else 'Not provided',#Shipping State
		'postal_code_shipping':'973',
		'country_shipping':'BHR',
		'other_charges':0,#Other chargs can be here
		'reference_no':'Ref-{}-{}'.format(user.id, user.order_id),#Pass the order id on your system for your reference
		'msg_lang':'en',#The language for the response
		'cms_with_version':'Nodejs Lib v1',#Feel free to change this
	}
	try:
		response = json.loads(requests.post("https://www.paytabs.com/apiv2/create_pay_page", data).text)
		if response['response_code'] == '4012':
			return {"success":True, "payment_url":response['payment_url'], "p_id":response['p_id']}

		return {"success":False}
	except:
		return {"success":False}

def send_emails(subject,html_content,to):
	from django.core.mail import BadHeaderError, EmailMultiAlternatives
	msg = EmailMultiAlternatives(subject, '', 'mudasirhamidraza@yahoo.com', to)
	msg.attach_alternative(html_content, "text/html")
	try:
		 res = msg.send()
	except BadHeaderError:
		return res
	return res