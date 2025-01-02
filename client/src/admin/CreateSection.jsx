import React, { useDebugValue, useEffect, useState } from 'react'
import { useNavigate,useParams } from 'react-router-dom'
import api  from '../redux/api';
const CreateSection = () => {
    const { courseId,weekId } = useParams();
    const [title,setTitle]=useState("");
    const [description,setDescription]=useState("")
    const navigate = useNavigate();
    const [orderId,setOrderId]=useState();
    const [typeId,setTypeId]=useState();
    const [contentUrl,setContentUrl]=useState("")
    const [typeData, setTypeData] = useState({}); // State to store the dictionary


    useEffect(() => {
      const fetchTypes = async () => {
          try {
              const res = await api.get('/type'); // Await the Promise
              
              if (res.data.result.success) {
                  // Convert array into a dictionary for quick access
                  const dictionary = res.data.result.data.reduce((acc, item) => {
                      acc[item.type_id] = item.type;
                      return acc;
                  }, {});
                  setTypeData(dictionary); // Update state
                 
              } else {
                  console.error('Error fetching types:', res.data);
              }
          } catch (error) {
              console.error('Error fetching types:', error);
          }
      };
  
      fetchTypes();
  }, []);
  useEffect(()=>{
    const fetchMaxOrder=async () => {

        try {
            
            const result=await api.get(`/admin/course/${courseId}/${weekId}/maxorder`)
            
        if(result.data.success){
            
            const currentOrder= result.data.maxOrder;
            
            setOrderId(currentOrder+1);

            
            
        }else{
            console.error('Error fetching Max order',result.data);
        }
        } catch (error) {
            console.error(error);
        }
    }
    fetchMaxOrder();
  },[]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
        const res=await api.post('/admin/section',{sectionData:{title,description,courseId,weekId,orderId,typeId,contentUrl}});
        console.log('successfully registerd')
        //notification
        navigate(`/admin/course/${courseId}`)
    } catch (error) {
        console.error(error);
    }
};
  return (

<>
<h1>Create Section</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="type">Type:</label>
                    <select
                        id="type"
                        value={typeId || ""}
                        onChange={(e) => setTypeId(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select Type</option>
                        {Object.entries(typeData).map(([id, type]) => (
                            <option key={id} value={id}>{type}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="contentUrl">Content URL:</label>
                    <input
                        id="contentUrl"
                        type="text"
                        value={contentUrl}
                        onChange={(e) => setContentUrl(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
</>
    
    
  )
}

export default CreateSection