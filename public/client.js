const localhost = "http://localhost:3500"

let MyActualProject = {
    id: 0,
    name: "",
    description:""
}
let MyActualPiece = {
    id: 0,
    IdProjet: 0,
    Piecename: "",
    Piecedescription:""
}

let AllPlans = false;

document.addEventListener("DOMContentLoaded", () => {
    const BtnBurger = document.getElementById("sidebar")
    const BtnPiece = document.getElementById("sidePiece")
    const ShowPiece = document.getElementById("ShowPiece")
    const ButtonProject = document.getElementById("btnproject")
    const ListProject = document.getElementById("projectList")
    const Project = document.getElementById("Project")
    const ProjectTitle = document.getElementById("ProjectTitle")
    const DescriptionTitle = document.getElementById("DescriptionTitle")
    const deleteproject = document.getElementById("deleteproject")
    const ButtonPiece = document.getElementById("btnpiece")
    const PieceTitle = document.getElementById("PieceTitle")
    const DescriptionPieceTitle = document.getElementById("DescriptionPieceTitle")
    const Pieces = document.getElementById("listpiece")
    const deletepiece = document.getElementById("deletepiece")
    const FormUploads = document.getElementById("FormUploads")
    const FormUploadsPlans = document.getElementById("FormUploadsPlans")
    const FormAllPlans = document.getElementById("BtnAllPlans")
    const ShArchives = document.getElementById("ShowArchives")
    const Archives = document.getElementById("Archives")
    const ListArchives = document.getElementById("listArchives")
    const buttonArchives = document.getElementById("buttonArchives")
    const HiArchives = document.getElementById("HiddenArchives")
    const picturesContainerAllPlans = document.querySelector('#AllPlans');
    let DivShowPiece = document.getElementById("ShowPiece");

    //******************Keyup of Event************************
    ProjectTitle.addEventListener('keyup', UpdateProject)
    DescriptionTitle.addEventListener('keyup', UpdateProject)
    PieceTitle.addEventListener('keyup', UpdatePiece)
    DescriptionPieceTitle.addEventListener('keyup', UpdatePiece)
    //******************Click of Event************************
    BtnBurger.addEventListener("click", Translated)
    BtnPiece.addEventListener("click", TranslatedPiece)
    ButtonProject.addEventListener("click", CreateProject)
    deleteproject.addEventListener("click", DeleteProject)
    ButtonPiece.addEventListener("click", CreatePiece)
    deletepiece.addEventListener("click", DeletePiece)
    FormUploads.addEventListener("submit", submitImages)
    FormUploadsPlans.addEventListener("submit", submitPlans)
    FormAllPlans.addEventListener("click", submitAllPlans)
    ShArchives.addEventListener("click", ShowArchives)
    HiArchives.addEventListener("click", HiddenArchives)

    DisplayProject()
    let HArchives = document.getElementById("HiddenArchives")
    HArchives.style.display = "none"
    Archives.style.display = "none"

    function CreateProject() {
        fetch(localhost + "/api/Projet", {
            method: 'POST'
        })
            .then(res => console.log(res))
            .then(DisplayProject)
    }

    function CreatePiece() {
        fetch(localhost + "/api/Piece/" + MyActualProject.id + "/piece", {
            method: "POST"
        })
            .then(res => console.log(res))
            .then(DisplayPieces)
        ShowPiece.style.display = ""
    }

    function DisplayProject() {
        ShowPiece.style.display = ""
        fetch(localhost + "/api/Projets", {
            method: "GET"
        })
            .then(dataProject => dataProject.json())
            .then(function (dataProject) {
                ListProject.innerText = ""
                for (let i = 0; i < dataProject.length; i++) {
                    let p = document.createElement("p")
                    p.innerText = dataProject[i].Nom
                    p.addEventListener("click", function () {
                        LoadDataProject(dataProject, i)
                        DisplayPieces()
                        ShowPiece.style.display = ""
                    })
                    let a = document.createElement("button")
                    let imga = document.createElement("img")
                    imga.src = "/img/archives.png";
                    imga.style.height = '20px';
                    a.style.marginRight = '10px'
                    a.style.marginLeft = '10px'
                    a.append(imga)

                    let b = document.createElement("button")
                    let imgb = document.createElement("img")
                    imgb.src = "/img/trash.png";
                    imgb.style.height = '20px';
                    imgb.style.padding = '1px';
                    b.append(imgb)

                    ListProject.append(p)
                    p.append(a)
                    p.append(b)

                    imga.addEventListener("click", function () {
                        fetch(localhost + "/api/ArchiveProject/" + MyActualProject.id, {
                            method: "PUT"
                        })
                            .then(DisplayProject)
                            .then(DisplayArchives)
                    })
                }
             })
    }

    function DisplayPieces() {
        ShowPiece.style.display = ""
        fetch(localhost + "/api/PiecesOfProjets/" + MyActualProject.id, {
            method: "GET"
        })
            .then(dataPiece => dataPiece.json())
            .then(function (dataPiece) {
                console.log(MyActualProject)
                Pieces.innerText = ""
                for (let i = 0; i < dataPiece.length; i++) {
                    let p = document.createElement("p");
                    p.innerText = dataPiece[i].Nom
                    p.addEventListener("click", function () {
                        LoadDataPiece(dataPiece, i)
                        ShowPiece.style.display = ""
                    })
                    Pieces.append(p);
                }
            })
    }

    function UpdateProject() {
        MyActualProject.name = ProjectTitle.innerText
        MyActualProject.description = DescriptionTitle.innerText

        fetch(localhost + "/api/UpdateProjet/" + MyActualProject.id, {
            method: 'PUT',
            body: JSON.stringify(MyActualProject),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(DisplayProject)
    }

    function UpdatePiece() {
        MyActualPiece.Piecename = PieceTitle.innerText
        MyActualPiece.Piecedescription = DescriptionPieceTitle.innerText

        fetch(localhost + "/api/UpdatePiece/" + MyActualPiece.id, {
            method: 'PUT',
            body: JSON.stringify(MyActualPiece),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(DisplayPieces)
    }

    function DeleteProject() {
        fetch(localhost + "/api/DeleteProject/" + MyActualProject.id, {
            method: 'Delete'
        })
            .then(DisplayProject)
    }

    function DeletePiece() {
        fetch(localhost + "/api/DeletePiece/" + MyActualPiece.id, {
            method: 'Delete'
        })
            .then(DisplayPieces)
    }

    function LoadDataProject(data, i) {
        MyActualProject.id = data[i].ID
        MyActualProject.name = data[i].Nom
        MyActualProject.description = data[i].Description

        ProjectTitle.innerText = MyActualProject.name
        DescriptionTitle.innerText = MyActualProject.description
    }

    function LoadDataPiece(data, i,) {
        MyActualPiece.id = data[i].ID
        MyActualPiece.PieceProjid = data[i].IdProjet
        MyActualPiece.Piecename = data[i].Nom
        MyActualPiece.Piecedescription = data[i].Description
        console.log(MyActualPiece)

        PieceTitle.innerText = MyActualPiece.Piecename
        DescriptionPieceTitle.innerText = MyActualPiece.Piecedescription

        //***************Permet de mettre à jour l'affichage des plans***********
        document.querySelector('#Plans').innerText = ""
        fetch(localhost + "/uploads/" + MyActualPiece.id,{
            method:"GET"
        })
            .then(data => data.json())
            .then(function (data) {
                DisplayPlans(data)
            })

        DisplayImages()
        DisplayPlans()
    }
    function submitImages() {
        fetch(localhost + "/uploads_img/" + MyActualPiece.id, {
            method: 'POST',
            body: new FormData(document.getElementById("FormUploads"))
        })
            .then(res => res.json())
            .then(DisplayImages)
            .catch((err) => ("Error occured", err));
    }
    function DisplayImages() {
        const picturesContainer = document.querySelector('#Pictures');
        picturesContainer.innerText = "";
        fetch(localhost + "/uploads/" + MyActualPiece.id, {
            method: "GET"
        })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error(`Les images pour la pièce avec l'ID ${MyActualPiece.id} n'ont pas été trouvées.`);
                    } else {
                        throw new Error(`Erreur lors de la récupération des données : ${response.status}`);
                    }
                }
                return response.json();
            })
            .then(data => {
                for (let i = 0; i < data.length; i++) {
                    let img = document.createElement('img');
                    img.src = "uploads/" + data[i].Nom;
                    picturesContainer.append(img);
                }
            })
            .catch(error => {
                console.error(error);
                // Gérer les erreurs ici, par exemple, afficher un message à l'utilisateur.
            });
    }

    function submitPlans(e){
        fetch(localhost + "/uploads_plans/" + MyActualPiece.id, {
            method: 'POST',
            body: new FormData(document.getElementById("FormUploadsPlans"))
        })
            .then(res => res.json())
            .then(DisplayPlans)
            .catch((err) => ("Error " + err));
    }
    function DisplayPlans(data) {
        const picturesContainer = document.querySelector('#Plans');
        picturesContainer.innerText = "";
        fetch(localhost + "/uploads_SendPlan/" + MyActualPiece.id, {
            method: "GET"
        })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error(`Les plans pour la pièce avec l'ID ${MyActualPiece.id} n'ont pas été trouvées.`);
                    } else {
                        throw new Error(`Erreur lors de la récupération des données : ${response.status}`);
                    }
                }
                return response.json();
            })
            .then(data => {
                for (let i = 0; i < data.length; i++) {
                    let img = document.createElement('img');
                    img.src = "uploads/" + data[i].Nom;
                    picturesContainer.append(img);
                }
            })
            .catch(error => {
                console.error(error);
                // Gérer les erreurs ici, par exemple, afficher un message à l'utilisateur.
            });
    }
    function submitAllPlans(){

        DivShowPiece.style.display = "none";
        picturesContainerAllPlans.innerText = "";


        if (AllPlans) {
            DivShowPiece.style.display = "";
            picturesContainerAllPlans.style.display = "none";
        } else {
            picturesContainerAllPlans.style.display = "";
            DivShowPiece.style.display = "none";
        }
        AllPlans = !AllPlans;

        fetch(localhost + "/uploads_AllPlan/" + MyActualProject.id, {
            method: "GET"
        })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error(`Les plans pour la pièce avec l'ID ${MyActualPiece.id} n'ont pas été trouvées.`);
                    } else {
                        throw new Error(`Erreur lors de la récupération des données : ${response.status}`);
                    }
                }
                return response.json();
            })
            .then(data => {
                for (let i = 0; i < data.length; i++) {
                    let img = document.createElement('img');
                    img.src = "uploads/" + data[i].Nom;
                    picturesContainerAllPlans.append(img);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
    function ShowArchives() {
        document.getElementById("Project").style.display = "none"
        ShArchives.style.display = "none"
        HArchives.style.display = ""
        Archives.style.display = ""
        DisplayArchives()
    }
    function DisplayArchives() {
        ListArchives.innerText = "";
        buttonArchives.innerText = "";

        fetch(localhost + "/api/ProjetsArchives", {
            method: "GET"
        })
            .then(dataProject => dataProject.json())
            .then(function (dataProject) {
                for (let i = 0; i < dataProject.length; i++) {
                    let c = document.createElement("p");
                    c.innerText = dataProject[i].Nom;
                    c.classList.add("pNomArchives");

                    let imgc = document.createElement("img");
                    imgc.src = "/img/archives.png";
                    imgc.style.height = '30px';

                    let imgd = document.createElement("img");
                    imgd.src = "/img/trash.png";
                    imgd.style.height = '30px';

                    ListArchives.append(c);

                    let imgContainer = document.createElement("div");
                    imgContainer.style.flexDirection = "column";
                    imgContainer.style.marginBottom = "50px";

                    imgContainer.append(imgc);
                    imgContainer.append(imgd);

                    buttonArchives.append(imgContainer);

                    imgc.addEventListener("click", function () {
                        fetch(localhost + "/api/UnArchiveProject/" + dataProject[i].ID, {
                            method: "PUT"
                        })
                            .then(DisplayArchives)
                            .then(DisplayProject)
                    })

                    imgd.addEventListener("click", function () {
                        fetch(localhost + "/api/DeleteProject/" + dataProject[i].ID, {
                            method: "DELETE"
                        })
                            .then(DisplayArchives)
                    })
                }
            });
    }

    function HiddenArchives(){
        document.getElementById("Project").style.display = ""
        ShArchives.style.display = ""
        HArchives.style.display = "none"
        Archives.style.display = "none"
    }
    function Translated() {
        Project.classList.toggle("translated")
    }
    function TranslatedPiece() {
        ShowPiece.classList.toggle("translatedPiece")
    }
})