import rdfextras
import rdflib
from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS

rdfextras.registerplugins()

app = Flask(__name__)
CORS(app)
# Basic configuration of the app
fileFinki = "/home/wbsfinki/mysite/finki.ttl"

ns = {
    "foaf": rdflib.Namespace("http://xmlns.com/foaf/0.1/"),
    "wbsfinki": rdflib.Namespace("http://wbsfinki.pythonanywhere.com/data#"),
    "aiiso": rdflib.Namespace("http://purl.org/vocab/aiiso/schema#"),
    "aiiso-roles": rdflib.Namespace("http://purl.org/vocab/aiiso-roles/schema#"),
    "rdfs": rdflib.RDFS,
    "rdf": rdflib.RDF,
    "dbo": rdflib.Namespace("http://dbpedia.org/ontology/"),
    "schema": rdflib.Namespace("http://schema.org/")
}


# Home Route
#@app.route("/")
#def _main():
#    return jsonify({"success": True})


@app.route("/create_ontology")
def create_ontology():
    g = rdflib.Graph()
    g.parse(fileFinki, format="ttl")
    #defining finki ontology

    g.set((ns["wbsfinki"].forStaff, ns["rdf"].type, ns["rdf"].Property))
    g.set((ns["wbsfinki"].forStaff, ns["rdfs"].domain, ns["rdfs"].comment))
    g.set((ns["wbsfinki"].forStaff, ns["rdfs"].range, ns["foaf"].Person))

    g.set((ns["wbsfinki"].forSubject, ns["rdf"].type, ns["rdf"].Property))
    g.set((ns["wbsfinki"].forSubject, ns["rdfs"].domain, ns["rdfs"].comment))
    g.set((ns["wbsfinki"].forSubject, ns["rdfs"].range, ns["aiiso"].Course))

    g.set((ns["wbsfinki"].academicYear, ns["rdf"].type, ns["rdf"].Property))
    g.set((ns["wbsfinki"].academicYear, ns["rdfs"].domain, ns["aiiso"].Course))
    g.set((ns["wbsfinki"].academicYear, ns["rdfs"].range, ns["rdfs"].Literal))

    g.set((ns["wbsfinki"].semestar, ns["rdf"].type, ns["rdf"].Property))
    g.set((ns["wbsfinki"].semestar, ns["rdfs"].domain, ns["aiiso"].Course))
    g.set((ns["wbsfinki"].semestar, ns["rdfs"].range, ns["rdfs"].Literal))

    g.set((ns["wbsfinki"].waysToPass, ns["rdf"].type, ns["rdf"].Property))
    g.set((ns["wbsfinki"].waysToPass, ns["rdfs"].domain, ns["aiiso"].Course))
    g.set((ns["wbsfinki"].waysToPass, ns["rdfs"].range, ns["rdfs"].Literal))

    g.set((ns["wbsfinki"].mustListenBefore, ns["rdf"].type, ns["rdf"].Property))
    g.set((ns["wbsfinki"].mustListenBefore, ns["rdfs"].domain, ns["aiiso"].Course))
    g.set((ns["wbsfinki"].mustListenBefore, ns["rdfs"].range, ns["aiiso"].Course))

    g.set((ns["wbsfinki"].mustPassedBefore, ns["rdf"].type, ns["rdf"].Property))
    g.set((ns["wbsfinki"].mustPassedBefore, ns["rdfs"].domain, ns["aiiso"].Course))
    g.set((ns["wbsfinki"].mustPassedBefore, ns["rdfs"].range, ns["aiiso"].Course))

    g.set((ns["wbsfinki"].role, ns["rdf"].type, ns["rdf"].Property))
    g.set((ns["wbsfinki"].role, ns["rdfs"].domain, ns["foaf"].Person))
    g.set((ns["wbsfinki"].role, ns["rdfs"].range, ns["aiiso-roles"].Role))

    g.set((ns["wbsfinki"].hasMandatory, ns["rdf"].type, ns["rdf"].Property))
    g.set((ns["wbsfinki"].hasMandatory, ns["rdfs"].domain, ns["aiiso"].Programme))
    g.set((ns["wbsfinki"].hasMandatory, ns["rdfs"].range, ns["aiiso"].Course))

    g.set((ns["wbsfinki"].hasOptional, ns["rdf"].type, ns["rdf"].Property))
    g.set((ns["wbsfinki"].hasOptional, ns["rdfs"].domain, ns["aiiso"].Programme))
    g.set((ns["wbsfinki"].hasOptional, ns["rdfs"].range, ns["aiiso"].Course))

    g.serialize(fileFinki, "ttl")
    g.close()
    return format(g.serialize(format="ttl"))


@app.route('/create-staff', methods=['POST'])
def create_staff():
    data = request.get_json(force=True)
    # validation
    if not data["foaf__givenName"] or not data["foaf__familyName"]:
        return {"error": "Името и презимето се задолжителни"}
    formated = formatData(data)
    uri = data["foaf__givenName"] + "_" + data["foaf__familyName"]

    g = rdflib.Graph()
    g.parse(fileFinki, format="ttl")
    uri = ns["wbsfinki"][uri.lower()]
    for item in formated:
        g.add((uri, item[0], item[1]))
    g.add((uri, ns["rdf"].type, ns["foaf"].Person))
    g.add((uri, ns["foaf"].name, rdflib.Literal(data["foaf__givenName"] + " " + data["foaf__familyName"])))
    g.serialize(fileFinki, "ttl")
    g.close()
    return {'success': "Super"}


@app.route('/create-study-program', methods=['POST'])
def create_study_program():
    data = request.get_json(force=True)
    # validation
    if not data["rdfs__label"]:
        return {"error": "Називнот на студиската програма е задолжителен"}
    formated = formatData(data)
    uri = data["rdfs__label"].replace(" ", "_").lower()
    g = rdflib.Graph()
    g.parse(fileFinki, format="ttl")
    uri = ns["wbsfinki"][uri]
    for item in formated:
        g.add((uri, item[0], item[1]))

    g.add((uri, ns["rdf"].type, ns["aiiso"].Programme))
    g.add((ns["wbsfinki"]["finki"], ns["aiiso"].teaches, uri))
    g.serialize(fileFinki, "ttl")
    g.close()
    return {'success': "Super"}

@app.route("/write-comment", methods=['POST'])
def create_comment():
    data = request.get_json(force=True)
    #validation
    if not data["rdfs__comment"]:
        return {"error":"Коментарот не е валиден"}
    formated = formatData(data)
    g = rdflib.Graph()
    g.parse(fileFinki, format="ttl")
    uri = ns["wbsfinki"]["finki"]
    for item in formated:
        g.add((uri, item[0], item[1]))
    g.serialize(fileFinki, "ttl")
    g.close()
    return {"success":"Успешно"}


@app.route("/create-course", methods=['POST'])
def create_course():
    data = request.get_json(force=True)
    if not data["code"] or not data["rdfs__label"]:
        return {"error": "Кодот и името се задолжителни"}
    comments = []
    key = 0
    for value in data["rdfs__comment"]:
        if key > 0:
            comments.append(value)
        key += 1
    data["rdfs__comment"] = [data["rdfs__comment"][0]]

    # SAVE
    g = rdflib.Graph()
    g.parse(fileFinki, format="ttl")
    uri = ns["wbsfinki"][data["code"].lower()]
    g.add((uri, ns["rdf"].type, ns["aiiso"].Course))
    g.add((uri, ns["aiiso"]["part_of"], ns["wbsfinki"].finki))
    # add all
    formated = formatData(data)
    for item in formated:
        g.add((uri, item[0], item[1]))

    # comment for prof
    key = 0
    for value in comments:
        uriC = ns["wbsfinki"][data["code"] + "comment_" + str(key)]
        g.add((uriC, ns["rdfs"].comment, rdflib.Literal(value)))
        g.add((uriC, ns["rdf"].type, ns["rdfs"].comment))
        g.add((uriC, ns["wbsfinki"].forStaff, rdflib.URIRef(data["aiiso__responsibilityOf"][key])))
        g.add((uriC, ns["wbsfinki"].forSubject, uri))
        key += 1
    g.serialize(fileFinki, "ttl")
    g.close()
    return {"success": "Зачувано"}

@app.route("/edit-course/<code>", methods=['POST'])
def edit_course(code):
    data = request.get_json(force=True)

    comments = []
    key = 0
    for value in data["rdfs__comment"]:
        if key > 0:
            comments.append(value)
        key += 1
    data["rdfs__comment"] = [data["rdfs__comment"][0]]

    # SAVE
    g = rdflib.Graph()
    g.parse(fileFinki, format="ttl")
    uri = ns["wbsfinki"][code]

    g.remove((uri, ns["wbsfinki"].academicYear, None))
    g.remove((uri, ns["wbsfinki"].mustListenBefore, None))
    g.remove((uri, ns["wbsfinki"].mustPassedBefore, None))
    g.remove((uri, ns["wbsfinki"].semestar, None))
    g.remove((uri, ns["wbsfinki"].waysToPass, None))
    g.remove((uri, ns["wbsfinki"].responsibilityOf, None))
    g.remove((uri, ns["wbsfinki"].comment, None))

    # add all
    formated = formatData(data)
    for item in formated:
        g.add((uri, item[0], item[1]))

    results = g.query("SELECT ?comment WHERE {?comment wbsfinki:forSubject wbsfinki:"+code+"}")
    for item in results:
        g.remove((rdflib.URIRef(item.comment), None, None))
    # comment for prof
    key = 0
    for value in comments:
        uriC = ns["wbsfinki"][code+ "comment_" + str(key)]
        g.add((uriC, ns["rdfs"].comment, rdflib.Literal(value)))
        g.add((uriC, ns["rdf"].type, ns["rdfs"].comment))
        g.add((uriC, ns["wbsfinki"].forStaff, rdflib.URIRef(data["aiiso__responsibilityOf"][key])))
        g.add((uriC, ns["wbsfinki"].forSubject, uri))
        key += 1
    g.serialize(fileFinki, "ttl")
    g.close()
    return {"success": "Зачувано"}

# FileReturn
@app.route("/data")
def serve_files():
    return send_from_directory('', "finki.ttl")


# All proffesors
@app.route("/get_all_professors")
def get_all_professors():
    g = rdflib.Graph()
    g.parse(fileFinki, format="ttl")
    results = g.query("""
        SELECT DISTINCT ?professor ?name ?role ?title ?img
        WHERE {
        ?professor foaf:name ?name .
        ?professor wbsfinki:role ?role .
        ?professor foaf:title ?title .
        ?professor foaf:img ?img
        } ORDER BY ?name
    """)
    professors = []
    for item in results:
        professors.append(
            {"uri": item.professor, "name": item.name, "role": item.role, "title": item.title, "img": item.img,
             "id": item.professor.split("#")[1]})
    return jsonify(professors)


# All proffesors
@app.route("/staff/<staff>")
def get_staff(staff):
    g = rdflib.Graph()
    g.parse(fileFinki, format="ttl")
    uri = "wbsfinki:" + staff
    results = g.query("""
        SELECT DISTINCT  ?name ?title ?img ?birthDate ?birthPlace ?homepage ?schoolHomepage ?comment
        WHERE {
        """ + uri + """ foaf:name ?name ;
                    foaf:title ?title ;
                    foaf:img ?img ;
        OPTIONAL { """ + uri + """ dbo:birthDate ?birthDate }
        OPTIONAL { """ + uri + """ dbo:birthPlace ?birthPlace }
        OPTIONAL { """ + uri + """ foaf:homepage ?homepage }
        OPTIONAL { """ + uri + """ foaf:schoolHomepage ?schoolHomepage }
        OPTIONAL { """ + uri + """ rdfs:comment ?comment }
        }
    """)
    ret = {}
    for item in results:
        ret = {"name": item.name, "title": item.title, "img": item.img, "birthDate": item.birthDate,
                    "birthPlace": item.birthPlace, "homepage": item.homepage, "schoolHomepage": item.schoolHomepage,
                    "comment": item.comment}
    results = g.query("""
        SELECT DISTINCT ?role
        WHERE {
             """ + uri + """ wbsfinki:role ?role
        }
    """)
    roles = []
    for item in results:
        roles.append(item.role)
    ret["roles"] = roles

    results = g.query("""
    SELECT DISTINCT ?subject ?s
    WHERE {
        ?s aiiso:responsibilityOf """ + uri + """ .
        ?s rdfs:label ?subject
    }
    """)
    subjects = []
    for item in results:
        subjects.append({"uri":item.s.split("#")[1], "name":item.subject})
    ret["subjects"] = subjects
    return jsonify(ret)


#  All study programs
@app.route("/get-all-study-programs")
def get_all_study_programs():
    g = rdflib.Graph()
    g.parse(fileFinki, format="ttl")
    results = g.query("""
        SELECT DISTINCT ?name ?studyProgram
        WHERE {
        ?studyProgram rdf:type aiiso:Programme .
        ?studyProgram rdfs:label ?name
        }
    """)
    studyPrograms = []
    for item in results:
        studyPrograms.append({"label": item.name, "uri": item.studyProgram})
    return jsonify(studyPrograms)

#all comments about finki
@app.route("/get_homepage")
def get_homepage():
    g = rdflib.Graph()
    g.parse(fileFinki, format="ttl")
    results = g.query("""
    SELECT ?label ?abstract
    WHERE {
    wbsfinki:finki rdfs:label ?label ;
                   dbo:abstract ?abstract
    }
    """)

    finki = {}
    for item in results:
        finki = {"label": item.label, "abstract": item.abstract}
    results = g.query("""
        SELECT ?comment
        WHERE {
        wbsfinki:finki rdfs:comment ?comment
        }
        """)
    comments = []
    noComments = 0
    for item in results:
        if noComments < 12: comments.append(item.comment)
        noComments+=1
    finki["comments"] = comments
    finki["noComments"] = noComments

    results = g.query("""
            SELECT DISTINCT ?programme
            WHERE {
            ?programme rdf:type aiiso:Programme
            }
            """)
    noProgrammes = 0
    for item in results: noProgrammes+=1
    finki["noProgrammes"] = noProgrammes

    results = g.query("""
                SELECT DISTINCT ?staff
                WHERE {
                ?staff rdf:type foaf:Person
                }
                """)
    noStaff = 0
    for item in results: noStaff += 1
    finki["noStaff"] = noStaff

    results = g.query("""
                    SELECT DISTINCT ?subject
                    WHERE {
                    ?subject rdf:type aiiso:Course
                    }
                    """)
    noSubjects = 0
    for item in results: noSubjects += 1
    finki["noSubjects"] = noSubjects

    return jsonify(finki)

@app.route("/subjects/<subjectId>")
def getSubjectInformations(subjectId):
    g = rdflib.Graph()
    g.parse(fileFinki, format="ttl")
    uri = "wbsfinki:"+subjectId
    results = g.query("""
        SELECT DISTINCT ?name ?year ?semestar ?comment ?waysToPass
        WHERE {
            """+uri+""" rdfs:label ?name ;
                        wbsfinki:academicYear ?year ;
                        wbsfinki:semestar ?semestar .
            OPTIONAL {"""+uri+""" rdfs:comment ?comment }
            OPTIONAL {"""+uri+""" wbsfinki:waysToPass ?waysToPass }
        }
    """)
    ret = {}
    for item in results:
        ret = {"name":item.name, "year":item.year, "semestar":item.semestar, "comment": item.comment, "waysToPass": item.waysToPass}

    results = g.query("""
        SELECT DISTINCT ?label ?studyProgram
        WHERE {
            ?studyProgram wbsfinki:hasMandatory """+uri+""" .
            ?studyProgram rdfs:label ?label
        }
    """)
    mandatory=[]
    for item in results:
        mandatory.append({"label":item.label, "uri":item.studyProgram.split("#")[1]})
    ret["mandatory"] = mandatory


    results = g.query("""
            SELECT DISTINCT ?label ?studyProgram
            WHERE {
                ?studyProgram wbsfinki:hasOptional """ + uri + """ .
                ?studyProgram rdfs:label ?label
            }
        """)
    optional = []
    for item in results:
        optional.append({"label": item.label, "uri": item.studyProgram.split("#")[1]})
    ret["optional"] = optional

    results = g.query("""
                SELECT DISTINCT ?label ?subject
                WHERE {
                    """ + uri + """ wbsfinki:mustListenBefore ?subject .
                    ?subject rdfs:label ?label
                }
            """)
    listened = []
    for item in results:
        listened.append({"label": item.label, "uri": item.subject.split("#")[1]})
    ret["listen"] = listened

    results = g.query("""
                   SELECT DISTINCT ?label ?subject
                   WHERE {
                       """ + uri + """ wbsfinki:mustPassedBefore ?subject .
                       ?subject rdfs:label ?label
                   }
               """)
    passed = []
    for item in results:
        passed.append({"label": item.label, "uri": item.subject.split("#")[1]})
    ret["passed"] = passed

    results = g.query("""
                       SELECT ?text ?profName ?professor
                       WHERE {
                           ?comment wbsfinki:forSubject """ + uri + """ ;
                                wbsfinki:forStaff ?professor .
                                ?professor foaf:name ?profName
                            OPTIONAL {
                                ?comment rdfs:comment ?text
                            }
                       }
                   """)
    sProfessors = []
    for item in results:
        sProfessors.append({"comment": item.text, "profName":item.profName, "uriProf": item.professor.split("#")[1]})
    ret["professors"] = sProfessors


    return jsonify(ret)

#  Get subjects by study program
@app.route("/get-subjects/<studyProgram>")
def getSubjectsByStudyProgram(studyProgram):
    g = rdflib.Graph()

    g.parse(fileFinki, format="ttl")
    results = g.query("""
        SELECT ?subject ?label ?academicYear ?semestar
        WHERE {
        wbsfinki:""" + studyProgram + """ wbsfinki:hasMandatory ?subject .
        ?subject rdfs:label ?label .
        ?subject wbsfinki:academicYear ?academicYear .
        ?subject wbsfinki:semestar ?semestar .

        }
    """)
    subjects = []
    for item in results:
        subjects.append(
            {"type": "mandatory", "subject": item.subject, "label": item.label, "academicYear": item.academicYear,
             "semestar": item.semestar})
    results = g.query("""
            SELECT ?subject ?label ?academicYear ?semestar
            WHERE {
            wbsfinki:""" + studyProgram + """ wbsfinki:hasOptional ?subject .
            ?subject rdfs:label ?label .
            ?subject wbsfinki:academicYear ?academicYear .
            ?subject wbsfinki:semestar ?semestar .

            }
        """)
    for item in results:
        subjects.append(
            {"type": "optional", "subject": item.subject, "label": item.label, "academicYear": item.academicYear,
             "semestar": item.semestar})
    return jsonify(subjects)


# All subjects
@app.route("/get_all_subjects")
def get_all_subjects():
    g = rdflib.Graph()
    g.parse(fileFinki, format="ttl")
    results = g.query("""
        SELECT DISTINCT ?subject ?name ?year ?semestar
        WHERE {
        ?subject rdf:type aiiso:Course ;
                rdfs:label ?name ;
                wbsfinki:academicYear ?year ;
                wbsfinki:semestar ?semestar ;
        }
    """)
    subjects = []
    for item in results:
        mandatoryIn = g.query("""
                SELECT DISTINCT ?label ?studyProgram
                WHERE {
                    ?studyProgram wbsfinki:hasMandatory <""" + item.subject + """> ;
                                rdfs:label ?label
                }
            """)
        mandatory = []
        for z in mandatoryIn:
            mandatory.append({"label": z.label, "uri": z.studyProgram.split("#")[1]})
        subjects.append({"mandatory":mandatory, "uri": item.subject, "name": item.name, "year": item.year, "semestar": item.semestar})
    return jsonify(subjects)


def formatData(data):
    back = []
    for key, val in data.items():
        # if string is empty continue
        if not val: continue
        k = key.split("__")
        left = ns.get(k[0], None)
        if left is None: continue
        left = left[k[1]]
        right = None
        # not finki known onotlogy
        valList = []
        if type(val) is list:
            valList = val
        else:
            valList.append(val)

        for val in valList:
            if val.find("__") == -1:
                if (val.find("http") == 0):
                    right = rdflib.URIRef(val)
                else:
                    right = rdflib.Literal(val)
            else:
                v = val.split("__")
                right = ns.get(v[0], None)[v[1]]
            back.append((left, right))

    return back


if __name__ == "__main__": app.run(debug=True)