
const config = {
    url:"https://api.recursionist.io/builder/computers?type=",
    parentId:"target"
}

let cpuBrandInput = document.getElementById("cpu-brand");
let cpuModelInput = document.getElementById("cpu-model");

let gpuBrandInput = document.getElementById("gpu-brand");
let gpuModelInput = document.getElementById("gpu-model");

let amountInput = document.getElementById("ram-amount");
let ramBrandInput = document.getElementById("ram-brand");
let ramModelInput = document.getElementById("ram-model");

let storageTypeInput = document.getElementById("storage-type");
let storageSizeInput = document.getElementById("storage-size");
let storageBrandInput = document.getElementById("storage-brand");
let storageModelInput = document.getElementById("storage-model");

let addComputerBtn = document.getElementById("add-btn");

fetch(config.url + "cpu").then(response => response.json()).then(function(data){
    setCpuEvent(data);
})

fetch(config.url + "gpu").then(response => response.json()).then(function(data){
    setGpuEvent(data);
})

fetch(config.url + "ram").then(response => response.json()).then(function(data){
    setRamEvent(data);
})

setStorageEvent();

function setCpuEvent(data){
    let cpuMap = createCPUMap(data);

    cpuBrandInput.addEventListener("change", function(){
        cpuModelInput.innerHTML = `<option>-</option>`;
        let arr = cpuMap[cpuBrandInput.value];
        for(model of arr){
            cpuModelInput.innerHTML += `
                <option>${model}</option>
            `;
        }
    })
}

function createCPUMap(data){
    let intel = [];
    let amd = [];
    for(cpu of data){
        if(cpu.Brand == "Intel") intel.push(cpu.Model);
        else if(cpu.Brand == "AMD") amd.push(cpu.Model);
    }
    let cpuMap = {
        "Intel": intel,
        "AMD" : amd
    }
    return cpuMap;
}

function setGpuEvent(data){
    let gpuMap = createGPUMap(data);

    gpuBrandInput.addEventListener("change", function(){
        gpuModelInput.innerHTML = `<option>-</option>`;
        let arr = gpuMap[gpuBrandInput.value];
        for(model of arr){
            gpuModelInput.innerHTML+=`
                <option>${model}</option>
            `;
        }
    })
}

function createGPUMap(data){
    let gpuBrands = document.getElementById("gpu-brand").options;
    let gpuMap = {};

    for(let i = 1; i < gpuBrands.length; i++){
        gpuMap[gpuBrands[i].value] = [];
    }
    for(gpu of data){
        gpuMap[gpu.Brand].push(gpu.Model);
    }

    return gpuMap;
}

function setRamEvent(data){
    let ramMap = createRamMap(data);

    amountInput.addEventListener("change", function(){
        ramModelInput.innerHTML = `<option>-</option>`;
        ramBrandInput.innerHTML = `<option>-</option>`;
        if(amountInput.value != "-"){
            ramBrandInput.innerHTML +=`
                <option>G.SKILL</option>
                <option>Crucial</option>
                <option>Corsair</option>
                <option>HyperX</option>
            `
        }
    })

    ramBrandInput.addEventListener("change", function(){
        ramModelInput.innerHTML = `<option>-</option>`;
        let amount = amountInput.value;
        let brand = ramBrandInput.value;
        if(brand == "-") return;

        for(model of ramMap[brand]){
            let arr = model.split(" ");
            let stick = arr[arr.length - 1].charAt(0);
            if(stick == amount){
                ramModelInput.innerHTML += `<option>${model}</option>`;
            }
        }
    })
}

function createRamMap(data){
    let ramMap = {
        "G.SKILL": [],
        "Crucial" : [],
        "Corsair" : [],
        "HyperX" : []
    }
    for(ram of data){
        ramMap[ram.Brand].push(ram.Model);
    }
    return ramMap;
}

function setStorageEvent(){

    storageTypeInput.addEventListener("change", function(){
        storageSizeInput.innerHTML = `<option>-</option>`;
        storageBrandInput.innerHTML = `<option>-</option>`;
        storageModelInput.innerHTML = `<option>-</option>`;
        let type = storageTypeInput.value;
        if(type == "HDD"){
            let tbs = [12, 10, 8, 6, 5, 4, 3, 2, 1.5, 1];
            let gbs = [500, 450, 300, 250];
            for(tb of tbs) storageSizeInput.innerHTML +=`<option>${tb}TB</option>`;
            for(gb of gbs) storageSizeInput.innerHTML += `<option>${gb}GB</option>`;
        }
        else if(type == "SSD"){
            let tbs = [4, 2, 1];
            let gbs = [960, 800, 512, 500, 480, 400, 280, 256, 250, 128, 118, 58];
            for(tb of tbs) storageSizeInput.innerHTML +=`<option>${tb}TB</option>`;
            for(gb of gbs) storageSizeInput.innerHTML += `<option>${gb}GB</option>`;
        }
    })

    storageSizeInput.addEventListener("change", function(){
        if(storageTypeInput.value == "HDD"){
            fetch(config.url + "hdd").then(response => response.json()).then(function(data){
                setHddEvent(data);
            })
        }
        else if(storageTypeInput.value == "SSD"){
            fetch(config.url + "ssd").then(response => response.json()).then(function(data){
                    setSsdEvent(data);
                })
        }
    })
}

function setHddEvent(data){
    storageBrandInput.innerHTML = `<option>-</option>`;
    storageModelInput.innerHTML = `<option>-</option>`;

    if(storageTypeInput.value == "HDD" && storageSizeInput.value != "-"){
        let hddBrands = ["WD", "HGST", "Seagate", "Toshiba", "Hitachi"];
        for(brand of hddBrands){
            storageBrandInput.innerHTML += `<option>${brand}</option>`;
        }
    }
    storageBrandInput.addEventListener("change", function(){
        storageModelInput.innerHTML = `<option>-</option>`;
        if(storageTypeInput.value == "HDD"){
            let size = storageSizeInput.value;
            let storageBrand = storageBrandInput.value;

            for(hdd of data){
                if(hdd.Brand == storageBrand && hdd.Model.indexOf(" " + size) != -1){
                    storageModelInput.innerHTML += `<option>${hdd.Model}</option>`;
                }
            }
        }
    })
}


function setSsdEvent(data){

    storageBrandInput.innerHTML = `<option>-</option>`;
    storageModelInput.innerHTML = `<option>-</option>`;

    if(storageTypeInput.value == "SSD" && storageSizeInput.value != "-"){
        let ssdBrands = ["Intel", "Samsung", "Sabrent", "Corsair", "Gigabyte", "HP", "Crucial", "WD", "Adata", "Sandisk", "Mushkin", "Seagate", "XPG", "Plextor", "Nvme", "Zotac"];
        for(brand of ssdBrands){
            storageBrandInput.innerHTML += `<option>${brand}</option>`;
        }
    }

    storageBrandInput.addEventListener("change", function(){
        storageModelInput.innerHTML = `<option>-</option>`;
        if(storageTypeInput.value == "SSD"){
            let size = storageSizeInput.value;
            let storageBrand = storageBrandInput.value;

            for(ssd of data){
                if(ssd.Brand == storageBrand && ssd.Model.indexOf(" " + size) != -1){
                    storageModelInput.innerHTML += `<option>${ssd.Model}</option>`;
                }
            }
        }
    })
}

addComputerBtn.addEventListener("click", function(){
    let cpuBrand = cpuBrandInput.value;
    let cpuModel = cpuModelInput.value;
    let gpuBrand = gpuBrandInput.value;
    let gpuModel = gpuModelInput.value;
    let ramAmount = amountInput.value;
    let ramBrand = ramBrandInput.value;
    let ramModel = ramModelInput.value;
    let storageType = storageTypeInput.value;
    let storageSize = storageSizeInput.value;
    let storageBrand = storageBrandInput.value;
    let storageModel = storageModelInput.value;

    if(cpuBrand == "-" || cpuModel == "-" || gpuBrand == "-" || gpuModel == "-" ||ramAmount == "-" || ramBrand == "-" || ramModel == "-" || storageType == "-" || storageSize == "-" || storageBrand == "-" || storageModel == "-"){
        alert("Please fill in all forms.");
        return;
    }

    let computer = {
        "CPU" : {
            "Brand" : cpuBrand,
            "Model" : cpuModel
        },
        "GPU" : {
            "Brand" : gpuBrand,
            "Model" : gpuModel
        },
        "RAM" : {
            "Amount" : ramAmount,
            "Brand" : ramBrand,
            "Model" : ramModel
        },
        "Storage" : {
            "Type" : storageType,
            "Size" : storageSize,
            "Brand" : storageBrand,
            "Model" : storageModel
        }
    }
    let parent = document.getElementById(config.parentId);
    buildComputer(computer);
})

//continue
function buildComputer(computer){
    let parent = document.getElementById(config.parentId);

    fetch(config.url + "cpu").then(response => response.json()).then(function(data){
        computer.CPU["Benchmark"] = catchBenchmark(data, computer, "CPU");
    })
    fetch(config.url + "gpu").then(response => response.json()).then(function(data){
        computer.GPU["Benchmark"] = catchBenchmark(data, computer, "GPU");
    })
    fetch(config.url + "ram").then(response => response.json()).then(function(data){
        computer.RAM["Benchmark"] = catchBenchmark(data, computer, "RAM");
    })

    let hddOrSSD = computer.Storage.Type.toLowerCase();
    fetch(config.url + hddOrSSD).then(response => response.json()).then(function(data){
        computer.Storage["Benchmark"] = catchBenchmark(data, computer, "Storage");
    })

    const myTimeout = setTimeout(function(){

        parent.append(yourNewPC(computer));
    }, 100);
}

function catchBenchmark(data, computer, type){
    for(part of data){
        if(part.Model == computer[type].Model){
            return part["Benchmark"];
        }
    }
}

function catchStorageBenchmark(data, computer, type){
    for(part of data){
        if(part.Model == computer[type].Model){
            return part["Benchmark"];
        }
    }
}

let count = 0;
function yourNewPC(computer){
    console.log(computer);
    count++;
    let gaming = Math.floor(computer.CPU.Benchmark * 0.25 + computer.GPU.Benchmark * 0.6 + computer.RAM.Benchmark * 0.125 + computer.Storage.Benchmark * 0.025);
    let work = Math.floor(computer.CPU.Benchmark * 0.6 + computer.GPU.Benchmark * 0.25 + computer.RAM.Benchmark * 0.1 + computer.Storage.Benchmark * 0.05);;

    let computerDiv = document.createElement("div");
    computerDiv.classList.add("bg-primary", "text-white", "mt-2");
    computerDiv.innerHTML = `
        <div class="container">
            <div class="d-flex justify-content-center m-3">
                <h1>Your PC${count}</h1>
            </div>
            <p style="font-size:30px">CPU</p>
            <p class="mb-0">Brand: ${computer.CPU.Brand}</p>
            <p>Model: ${computer.CPU.Model}</p>
            <p style="font-size:30px">GPU</p>
            <p class="mb-0">Brand: ${computer.GPU.Brand}</p>
            <p>Model: ${computer.GPU.Model}</p>
            <p style="font-size:30px">RAM</p>
            <p class="mb-0">Brand: ${computer.RAM.Brand}</p>
            <p>Model: ${computer.RAM.Model}</p>
            <p style="font-size:30px">Storage</p>
            <p class="mb-0">Disk: ${computer.Storage.Type}</p>
            <p class="mb-0">Storage: ${computer.Storage.Size}</p>
            <p class="mb-0">Brand: ${computer.Storage.Brand}</p>
            <p>Model: ${computer.Storage.Model}</p>
            <div class="d-flex mb-3">
                <div class="col-6 text-center">
                    <p style="font-size:35px">Gaming: ${gaming}%<p>
                </div>
                <div class="col-6 text-center">
                    <p style="font-size:35px">Work: ${work}%</p>
                </div>
            </div>
        </div>
    `
    return computerDiv;
}
