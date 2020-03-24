import json

import rdfextras
import rdflib
from flask import Flask, send_from_directory

rdfextras.registerplugins()

app = Flask(__name__)

# Basic configuration of the app
fileFinki = "data/finki.ttl"

wbsfinki = rdflib.Namespace("http://localhost:5000/data#")
aiiso = rdflib.Namespace("http://purl.org/vocab/aiiso/schema#")


# Home Route
@app.route("/")
def _main():
    return send_from_directory("", "index.html")


@app.route("/test")
def test():
    c = rdflib.Dataset
    g = rdflib.Graph()
    g.parse(fileFinki, format="ttl")

    label = rdflib.Literal("Faculty of bla")
    comment = rdflib.Literal("Jako nesto")
    g.add((wbsfinki.finki, rdflib.RDFS.label, label))
    g.add((wbsfinki.finki, rdflib.RDFS.comment, comment))
    g.add((wbsfinki.finki, rdflib.RDF.type, aiiso.Faculty))
    g.add((wbsfinki.finki, aiiso.teaches, wbsfinki.pit))
    g.serialize(fileFinki, "ttl")

    results = g.query("""
        SELECT DISTINCT ?programa ?label
        WHERE {
            ?faculty aiiso:teaches ?programa .
            ?programa rdfs:label ?label
        }
        """)


    # Cities to be stored
    cities = []

    for row in results:
        # Append each pharmacy
        cities.append(row)

    return json.dumps(cities)


# FileReturn
@app.route("/data")
def serve_files():
    return send_from_directory('data/', "finki.ttl")


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
