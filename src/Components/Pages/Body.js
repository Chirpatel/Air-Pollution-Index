import React ,{useState,useEffect} from 'react';
import ActivateApi from '../Api/ActivateApi';
import StateApi from '../Api/StatesApi'
import CityApi from '../Api/CityApi'
import CityDataApi from '../Api/CityDataApi'
import UpdatedDateApi from '../Api/UpdatedDateApi'
import './Body.css'
function Body() {
    const [isLoading,setLoading] = useState(true);
    const [states,setStates] = useState([]);
    const [currentState,setCurrentstate] = useState("Default");
    const [Cities,setCities] = useState([]);
    const [currentCity,setCurrentcity] = useState("Default");
    const [isStateChanged,setStatechanged] = useState(false);
    const [isCityChanged,setCitychanged] = useState(false);
    const [currentData,setCurrentData] = useState({});
    const [updatedDate,setUpdateddate] = useState("");
    const [isSubmit,setSubmit] = useState(false);
    const pollutantsData = {
        "PM10" :[0,51,101,251,351,430],
        "PM2.5" :[0,31,61,91,121,250],
        "NO2" :[0,41,81,181,281,400],
        "SO2" :[0,41,81,381,801,1600],
        "CO" :[0,1.1,2.1,10,17,34],
        "OZONE" :[0,51,101,169,209,748],
        "NH3" : [0,201,401,801,1200,1800]
    }
    const qualityColor = ["green","darkgreen","yellow","orange","red","darkred"]
    const qualityName =["Good","Satisfactory","Moderately polluted","Poor","Very poor","Severe"];
    const qualityCalc= (pollutant,value)=>{
        var ar = pollutantsData[pollutant]
        value = parseFloat(value)
        if(value>=ar[5]){
            return qualityColor[5];
        }else if(value>=ar[4]){
            return qualityColor[4];
        }else if(value>=ar[3]){
            return qualityColor[3];
        }else if(value>=ar[2]){
            return qualityColor[2];
        }else if(value>=ar[1]){
            return qualityColor[1];
        }else{
            return qualityColor[0];
        }
    }
    const handleStateClick= (e)=>{
        setCurrentstate(e.target.value);
        //console.log(e.target.value);
        if(e.target.value==="Default"){
            setCurrentcity("Default")
        }
        setCities([])
        setStatechanged(true)
        setSubmit(false);
    }
    const handleCityClickDefault = (e)=>{
        e.preventDefault()
        alert("Select State");
    }
    const handleCityClick= (e)=>{
        setCurrentcity(e.target.value);
        //console.log(e.target.value);
        setCurrentData({})
        setCitychanged(true)
        setSubmit(false);
    }
    const handleSubmit= ()=>{
        if(currentState==="Default"){
            alert("Select State");
        }
        else if(currentCity==="Default"){
            alert("Select City");
        }else{
            setSubmit(true);
        }
    }

    useEffect(()=>{
        const func = async ()=>{
            var data = await UpdatedDateApi();
            //console.log(data)
            //setUpdateddate(data.updateddate)
            var t = new Date(1970, 0, 1); // Epoch
            t.setSeconds(data.updateddate);
            //console.log(t);
            setUpdateddate(t.toString())
        }
        func();
    },[])

    useEffect(()=>{
        const func = async ()=>{
            var data =  await ActivateApi();
            if(data.value!==undefined){
                setLoading(false);
            }
        }
        func();
    },[setLoading])

    useEffect(()=>{
        const func= async ()=>{
            var data =  await StateApi();
            //console.log(data);
            setStates(data.states);
            setCurrentstate("Default");
            setCurrentcity("Default")
            setStatechanged(true)
        }
            func();
    },[setStates,setCurrentstate,setStatechanged])

    useEffect(()=>{
        const func= async ()=>{
            if(currentState!=="Default"){
                var data = await CityApi({State:currentState});
                //console.log(data)
                setCities(data.city)
                setCurrentcity("Default")
                setStatechanged(false)
                setCitychanged(true)
            }
        }
        if(isStateChanged){
            func();
        }
    },[isStateChanged,currentCity,currentState,setStatechanged,setCities,setCurrentcity])

    useEffect(()=>{
        const func = async ()=>{
            if(currentState!=="Default" && currentCity!=="Default"){
                var data = await CityDataApi({State:currentState,City:currentCity});
                //console.log(data);
                setCurrentData(data.data);
                setCitychanged(false)
            }
        }
        if(isCityChanged){
            func();
        }
    },[setCitychanged,isCityChanged,currentState,currentCity])
    const stylefunc = () =>{
        var randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        const style = {
        border: `2px solid ${randomColor}`
        }
        return style;
    }
    const stylecell = (color)=>{
        const style = {
            background: `${color}`
            }
            return style;
    }


    return (
        <>
        {isLoading &&
            <div className="loading">
                <div className="loading-text">
                    <div className="typewriter">
                        <h1>Loading...</h1>
                    </div>
                </div>
            </div>
        }
        {!isLoading &&
            <div className='body'>
                {updatedDate &&
                    <p className={"last-updated"}>Last Updated: {updatedDate}</p>
                }
                <div className={"select"}>
                    <div className={"option"}>
                        <div className={"option-state"}>
                            <select className={`option-state-select ${currentState==="Default"? "option-default":""}`} value={currentState} onChange={handleStateClick}>
                                <option className={"option-default"} value={"Default"}>Select State</option>
                                {states &&
                                    states.map((item,i)=>{
                                        return <option className={"option-regular"} key={i} value={item}>{item.replace("_"," ")}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className={"option-city"}>
                            <select className={`option-city-select ${currentCity==="Default"? "option-default":""} ${isStateChanged ? "option-prevent-click":""}`} value={currentCity} onClick={isStateChanged ? handleCityClickDefault: null} onChange={handleCityClick}>
                                <option className={"option-default"} value={"Default"}>Select City</option>
                                {!isStateChanged && Cities &&
                                    Cities.map((item,i)=>{
                                        return <option className={"option-regular"} key={i} value={item}>{item}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className={"option-button"}>
                                <div className={"option-button-submit"}>
                                    <button onClick={handleSubmit}>Get</button>
                                </div>
                        </div>
                    </div>
                </div>
                <div className={"data-view-container"}>
                    
                        {isSubmit && !isCityChanged && currentData &&
                            <div className={`data-view-body ${Object.keys(currentData).length<=1 ? "data-view-body1":(Object.keys(currentData).length===2 ? "data-view-body2":"data-view-body3")}`}>
                            {Object.keys(currentData).map((item,i)=>{
                                
                                return <div className={"data-view-column"} style={stylefunc()} key={i}>
                                        <h1>{item}</h1>
                                        <table className={"data-view-table"}>
                                            <thead>
                                                <tr>
                                                    <th></th>
                                                    <th>Average</th>
                                                    <th>Minimum</th>
                                                    <th>Maximum</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                        {Object.keys(currentData[item]).map((pollutant,i)=>{
                                            if(currentData[item][pollutant].avg!=="NA"&&currentData[item][pollutant].min!=="NA"&&currentData[item][pollutant].max!=="NA"){
                                            return <tr key={i}>
                                                    <td>{pollutant}</td>
                                                    <td>
                                                        <div className='box tooltip' style={stylecell(qualityCalc(pollutant,currentData[item][pollutant].avg))}>
                                                            <span className="tooltiptext">{qualityName[qualityColor.indexOf(qualityCalc(pollutant,currentData[item][pollutant].avg))]}</span>
                                                        </div>
                                                        {currentData[item][pollutant].avg}
                                                    </td>
                                                    <td>
                                                        <div className='box tooltip' style={stylecell(qualityCalc(pollutant,currentData[item][pollutant].min))}>
                                                            <span className="tooltiptext">{qualityName[qualityColor.indexOf(qualityCalc(pollutant,currentData[item][pollutant].min))]}</span>
                                                        </div>
                                                        {currentData[item][pollutant].min}
                                                    </td>
                                                    <td>
                                                        <div className='box tooltip' style={stylecell(qualityCalc(pollutant,currentData[item][pollutant].max))}>
                                                            <span className="tooltiptext">{qualityName[qualityColor.indexOf(qualityCalc(pollutant,currentData[item][pollutant].max))]}</span>
                                                        </div>
                                                        {currentData[item][pollutant].max}
                                                    </td>
                                                </tr>
                                            }else{
                                                return null
                                            }
                                        })
                                        
                                        }

                                            </tbody>
                                        </table>
                                    </div>
                                
                            })}
                        </div>
                        }
                    
                </div>
            </div>
        }
        <div className={"disclaimer"}>
            Disclamier: The Data represented is fetched from <a href="https://data.gov.in/resources/real-time-air-quality-index-various-locations/api" target="_blank" rel="noreferrer">data.gov.in</a>.
            The Quality review is referred from <a href="https://en.wikipedia.org/wiki/Air_quality_index" target="_blank" rel="noreferrer">wikipedia.org</a>
        </div>
        </>
    )
}

export default Body
