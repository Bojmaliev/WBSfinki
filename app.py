from flask import Flask, send_from_directory
from flask import request
from urllib.parse import unquote
import rdflib
import rdfextras
import json
import sys
rdfextras.registerplugins()

app = Flask(__name__)

# Basic configuration of the app
fileFinki = "data/finki.ttl"

prefix = rdflib.Namespace("http://localhost:5000/data/")

# Home Route
@app.route("/")
def _main():
    return send_from_directory("", "index.html")


@app.route("/test")
def test():
    g = rdflib.Graph()
    g.parse(fileFinki, format="ttl")

    label = rdflib.Literal("Faculty of bla")
    comment = rdflib.Literal("Jako nesto")

    finki = prefix.finki
    g.add((finki, rdflib.RDFS.label, label))
    g.add((finki, rdflib.RDFS.comment, comment))
    f = open(fileFinki, "w+")
    towrite = g.serialize(format="ttl").decode("utf-8")
    f.write(towrite)
    f.close()

    return json.dumps({"status": "Successful", "message":"FINKI v1.0.0 - API connection successful"})


# FileReturn
@app.route("/data/<file>")
def serve_files(file):
    return send_from_directory('data/', file+".ttl")


# All cities available
# @app.route("/cities")
# def cities():
#
#     # Load the graph with data
#     g=rdflib.Graph()
#     g.parse(dataURL, format='ttl')
#
#     # Prepare the query
#     results = g.query("""
#     SELECT DISTINCT ?city
#     WHERE {
#     ?address <http://schema.org/addressLocality> ?city .
#     }
#     ORDER BY (?city)
#     """)
#
#     # Cities to be stored
#     cities = []
#
#     for row in results:
#         # Append each pharmacy
#         cities.append(row.city)
#
#     return json.dumps(cities)
#
#
# # Pharmacies by name
# @app.route("/pharmacies")
# def pharmacies():
#
#     # Name by which we filter the pharmacies
#     name = request.args.get('name')
#     if name is None:
#         name = ""
#
#     # Load the graph with data
#     g=rdflib.Graph()
#     g.parse(dataURL, format='ttl')
#
#     # Prepare the query
#     results = g.query("""
#     SELECT ?name ?city ?pharmacy
#     WHERE {
#     ?pharmacy <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://schema.org/Pharmacy>.
#     ?pharmacy <http://schema.org/name> ?name .
#     ?pharmacy <http://schema.org/address> ?address .
#     ?address <http://schema.org/addressLocality> ?city .
#     filter contains(?name, '%s')
#     }
#     ORDER BY (?name)
#     LIMIT 15
#     """ % name)
#
#     # Pharmacies to be stored
#     pharmacies = []
#
#     for row in results:
#         # Append each pharmacy
#         pharmacies.append({'name': row.name, 'city': row.city, 'uri': row.pharmacy})
#
#     return json.dumps(pharmacies)
#
#
# # Pharmacies by city and type
# @app.route("/pharmacies/<city>")
# def pharmaciesInCity(city):
#
#     city = unquote(city)
#
#     # Load the graph with data
#     g=rdflib.Graph()
#     g.parse(dataURL, format='ttl')
#
#     # Prepare the query
#     results = g.query("""
#     SELECT ?name ?pharmacy ?adr ?lat ?lng
#     WHERE {
#     ?pharmacy <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://schema.org/Pharmacy>.
#     ?pharmacy <http://schema.org/name> ?name .
#     ?pharmacy <http://schema.org/address> ?address .
#     ?address <http://schema.org/streetAddress> ?adr .
#     ?address <http://schema.org/addressLocality> ?city .
#     ?pharmacy <http://schema.org/geo> ?geo .
#     ?geo <http://schema.org/latitude> ?lat .
#     ?geo <http://schema.org/longitude> ?lng .
#     filter contains(?city, '%s')
#     }
#     """ % city)
#
#     # Pharmacies to be stored
#     pharmacies = []
#
#     for row in results:
#         # Append each pharmacy
#         pharmacies.append({'name': row.name, 'uri': row.pharmacy, 'address': row.adr, 'latitude': row.lat, 'longitude': row.lng })
#
#     return json.dumps(pharmacies)
    
if __name__ == "__main__": app.run(debug=True)