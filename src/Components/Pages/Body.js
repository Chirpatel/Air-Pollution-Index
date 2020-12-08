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
    const [currentState,setCurrentstate] = useState("");
    const [Cities,setCities] = useState([]);
    const [currentCity,setCurrentcity] = useState("");
    const [isStateChanged,setStatechanged] = useState(false);
    const [isCityChanged,setCitychanged] = useState(false);
    const [currentData,setCurrentData] = useState({});
    const [updatedDate,setUpdateddate] = useState("");
    const handleStateClick= (e)=>{
        setCurrentstate(e.target.value);
        console.log(e.target.value);
        setCities([])
        setStatechanged(true)
    }
    const handleCityClick= (e)=>{
        setCurrentcity(e.target.value);
        console.log(e.target.value);
        setCurrentData({})
        setCitychanged(true)
    }
    useEffect(()=>{
        const func = async ()=>{
            var data = await UpdatedDateApi();
            console.log(data)
            //setUpdateddate(data.updateddate)
            var t = new Date(1970, 0, 1); // Epoch
            t.setSeconds(data.updateddate);
            console.log(t);
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
            console.log(data);
            setStates(data.states);
            setCurrentstate(data.states[0]);
            setStatechanged(true)
        }
            func();
    },[setStates,setCurrentstate,setStatechanged])

    useEffect(()=>{
        const func= async ()=>{
            var data = await CityApi({State:currentState});
            console.log(data)
            setCities(data.city)
            setCurrentcity(data.city[0])
            setStatechanged(false)
            setCitychanged(true)
        }
        if(isStateChanged){
            func();
        }
    },[isStateChanged,currentCity,currentState,setStatechanged,setCities,setCurrentcity])

    useEffect(()=>{
        const func = async ()=>{
            var data = await CityDataApi({State:currentState,City:currentCity});
            console.log(data);
            setCurrentData(data.data);
            setCitychanged(false)
        }
        if(isCityChanged){
            func();
        }
    },[setCitychanged,isCityChanged,currentState,currentCity])
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
                    <p>Last Updated: {updatedDate}</p>
                }
                {states &&
                    <select value={currentState} onChange={handleStateClick}>
                    {states.map((item,i)=>{
                        return <option key={i} value={item}>{item}</option>
                    })}
                    </select>
                }
                <select value={currentCity} onChange={handleCityClick}>
                {!isStateChanged && Cities &&
                    
                    Cities.map((item,i)=>{
                        return <option key={i} value={item}>{item}</option>
                    })
                    
                }
                </select>
                {!isCityChanged && currentData &&
                    Object.keys(currentData).map((item,i)=>{
                        return <div key={i}>
                                <h1>{item}</h1>
                                {Object.keys(currentData[item]).map((pollutant,i)=>{
                                    return <div key={i}> 
                                                <p>{pollutant} => Average: {currentData[item][pollutant].avg} Minimum: {currentData[item][pollutant].min} Maximum: {currentData[item][pollutant].max}</p> 
                                        </div>
                                })

                                }
                            </div>
                    })

                }
            </div>
        }
        
        </>
    )
}

export default Body
