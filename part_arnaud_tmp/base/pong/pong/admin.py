from django.contrib import admin

from .models import User, Game, Tournament

admin.site.register(User)
admin.site.register(Game)
admin.site.register(Tournament)