from google.appengine.ext import webapp

import httplib2
import jinja2
import os
import cgi
import datetime
import urllib
import webapp2
import logging

from google.appengine.ext import db
from google.appengine.api import users
from google.appengine.api import memcache
from google.appengine.ext.webapp.util import run_wsgi_app
from apiclient.discovery import build
import httplib2
from oauth2client.appengine import OAuth2Decorator
from oauth2client.appengine import OAuth2Handler
import settings

try:
    import json  # python 2.6
except ImportError:
    import simplejson as json  # python 2.4 to 2.5

jinja_environment = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))

decorator = OAuth2Decorator(client_id=settings.CLIENT_ID,
                            client_secret=settings.CLIENT_SECRET,
                            scope=settings.SCOPE)


class MainHandler(webapp.RequestHandler):

    @decorator.oauth_aware
    def get(self):
        if decorator.has_credentials():
            tmpl = jinja_environment.get_template('templates/index.html')
            if users.get_current_user():
                url = users.create_logout_url(self.request.uri)
                url_linktext = 'Logout'
            else:
                url = users.create_login_url(self.request.uri)
                url_linktext = 'Login'
        else:
            tmpl = jinja_environment.get_template('templates/grant.html')
            url = decorator.authorize_url()

        template_values = {
            'url': url,
            'user_email': 'romanangelo.tria@gmail.com'
        }
        self.response.out.write(tmpl.render(template_values))


class UploadHandler(webapp2.RequestHandler):
    def post(self):
        self.response.out.write(json.dumps({
            "test": "ola"
        }))

# app = webapp.WSGIApplication([
#     ('/', MainHandler),
#     ('/about', MainHandler),
#     ('/upload', UploadHandler),
#     (decorator.callback_path, decorator.callback_handler())
# ], debug=True)
def truncate(s, l):
    return s[:l] + '...' if len(s) > l else s

app = webapp.WSGIApplication(
   [
        ('/', MainHandler),
        ('/upload', UploadHandler),
        ('/oauth2callback', OAuth2Handler)
   ],
   debug=True)

if __name__ == '__main__':
    run_wsgi_app(app)
