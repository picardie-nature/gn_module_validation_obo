'''
   Spécification du schéma toml des paramètres de configurations
   Fichier spécifiant les types des paramètres et leurs valeurs par défaut
   Fichier à ne pas modifier. Paramètres surcouchables dans config/config_gn_module.tml
'''

from marshmallow import Schema, fields


class GnModuleSchemaConf(Schema):
    N_RANDOM = fields.Integer(missing=5) #Choisi 1 données parmis les N_RANDOM prioritaires (pour diminuer les risques que 2 validateurs évaluent simultanément la même donnée)
    ID_LISTE_TAXONS = fields.Integer(missing=600)

