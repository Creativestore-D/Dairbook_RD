from django.core.management.base import BaseCommand, CommandError
from item.models import AbAircrafts, AbSettings, AbEngines, AbApus
from info.models import AbCannedemails
from datetime import datetime, timedelta
from django.db.models import Q
from django.template.loader import get_template
from default.services import send_emails
from html.parser import HTMLParser

class Command(BaseCommand):
    help = 'Send asset expired notification to users'

    def handle(self, *args, **options):
        email_content = AbCannedemails.objects.filter(message_type__in=['asset-expiring', 'asset-expired'], is_active=1, deleted_at=None)
        asset_expiring = email_content.filter(message_type='asset-expiring')
        asset_expired = email_content.filter(message_type='asset-expired')

        # fetch assets notification periods - Type 1 is for asset notification
        asset_notifcations = AbSettings.objects.filter(type=1)

        # check if email template is set than send email
        if email_content.exists():
            # check if asset expiring template is set
            if not asset_expiring.exists():
                asset_notifcations.filter(key='expired_notify')
            else:
                asset_expiring = asset_expiring.first()
            
            if not asset_expired.exists():
                asset_notifcations.exclude(key='expired_notify')
            else:
                asset_expired = asset_expired.first()


            # check if any notification is set in settings 
            if asset_notifcations.exists():

                # we have handling three listings currently
                asset_listings = ['Engine','Aircraft','Apu']

                Qr = None
                
                notifications = asset_notifcations.values('id', 'value', 'key')
               
                i = 0
                while i < len(notifications):
                    for asset_list in asset_listings:
                        notifications[i][asset_list] = []

                     # fetch dates against those days from today
                    notifications[i]['date'] = (datetime.now()-timedelta(days=int(notifications[i]['value']))).date()
                    
                    # make query to fetch data against selecte days/dates
                    q = Q(**{'updated_at__contains':notifications[i]['date']})
                    Qr = Qr | q if Qr else q
                    i += 1

                # loop throught assets types
                for asset_list in asset_listings:
                    # fetch assets against status
                    assets = globals()['Ab{}s'.format(asset_list)].objects.filter(deleted_at=None, isactivestatus__in=['Pending Approval','Revise'])
                    if Qr:
                        assets = assets.filter(Qr)

                    # loop throught assets
                    for asset in assets:
                        notification = None
                        i = 0
                        while i < len(notifications):
                            if asset.updated_at.date() == notifications[i]['date']:
                                notification = notifications[i]
                            i += 1

                        # user contact not exist some times
                        try:
                            username = asset.user.contact.first().first_name + ' ' + asset.user.contact.first().last_name
                        except:
                            username = 'User'

                        # select template now - expiring or expired
                        if notification['key'] == 'expired_notify':
                            email_content = asset_expired
                        else:
                            email_content = asset_expiring

                        context = {
                            'name': username, 
                            'asset_type':asset_list, 
                            'asset':asset.title,
                            'days': notification['value']
                        }
                        html_content = get_template('email/canned/general.html').render({'email_content':get_template(email_content.message).render(context)})
                        res = send_emails(email_content.subject, html_content, [asset.user.email])

                        if res:
                            print('{} assets {} expirinig notification has been sent to user {}'.format(asset_list, asset.title, asset.user.email))
                            


