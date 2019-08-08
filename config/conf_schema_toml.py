'''
   Spécification du schéma toml des paramètres de configurations
   Fichier spécifiant les types des paramètres et leurs valeurs par défaut
   Fichier à ne pas modifier. Paramètres surcouchables dans config/config_gn_module.tml
'''

from marshmallow import Schema, fields


class GnModuleSchemaConf(Schema):
    SKIP_DELAY = fields.String(missing='1 days') #Temps pendant lequel une données "passée" n'est plus affiché à l'utilisateur
    LOCK_DELAY = fields.String(missing='10 minutes') #Temps de verrouillage d'une donnée affiché à un validateur
    ID_LISTE_TAXONS = fields.Integer(missing=600)

