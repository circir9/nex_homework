import React, { useState } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import './Calendar.css';
import './EmployeePage.css';
import CalendarSVGIcon from '../components/CalendarIcon/CalendarSVGIcon';

const API_URL = 'http://localhost:5118/api/Employee';

const EmployeePage = () => {
    const [curList, setCurList] = useState([]);
    const [newList, setNewList] = useState([]);

    const handleAdd = () => {
        setNewList([...newList, { id:Date.now().toString(), IsCalendarClick:false, name: '', dateOfBirth: new Date().toLocaleDateString('sv-SE'), salary: 50, address: '' }]);
    };
    
    const handleUpdate = () => {
        axios.get(`${API_URL}`).then((response) => {
            setCurList(formatDateOfBirth(response.data));
        });
    };

    const formatDateOfBirth = (originList) => {
        const formattedList = originList.map(item => {
            const formattedDate = item.dateOfBirth.split('T')[0];
            return {
                ...item,
                dateOfBirth: formattedDate
            };
        });
    
        return formattedList;
    };

    const updateItem = (id, key, value, setList) => {
        setList(prevList => 
          prevList.map(item => 
            item.id === id ? { ...item, [key]: value } : item
          )
        );
    };

    const removeItem = (id, tmpList, setList) => {
        setList(
            tmpList.filter(a =>
              a.id !== id
            )
        );
    };

    const handleCalendarChange = (id, key, value, setList) => {
        const formatDate = value.toLocaleDateString('sv-SE');
        updateItem(id, key, formatDate, setList);
        updateItem(id, 'IsCalendarClick', false, setList);
    };

    const handleCalendarBtnClick = (id, key, value, setList) => {
        updateItem(id, key, value, setList);
    };

    const handleSaveClick = async () => {
        // 檢查是否有空值或該姓名已經存入資料庫
        const isNeed = async (item) => {
            if(item.name !== '' && item.address !== ''){
                const response = await axios.get(`${API_URL}/${item.name}`);
                return !response.data;
            }
            return false;
        };
    
        const filterList = [];
        for (const item of newList){
            if (await isNeed(item)){
                filterList.push(item);
                axios.post(`${API_URL}`,
                {
                    name: item.name,
                    dateOfBirth: item.dateOfBirth,
                    salary: item.salary,
                    address: item.address
                },
                { 
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }
        }
    
        const newCurList = [
            ...curList,
            ...filterList.map(({ name, dateOfBirth, salary, address }) =>{
                return {name, dateOfBirth, salary, address};
            }),
        ];
        setCurList(newCurList);
    
        const removeIdFromNewList = filterList.map(item => item.id);
        const newNewList = [];
        for (const item of newList){
            if (!removeIdFromNewList.includes(item.id)){
                newNewList.push(item);
            }
        }
    
        setNewList(newNewList);
        if(newNewList.length!==0){
            alert("請檢查姓名是否重複抑或是否有未填寫之欄位");
        }
    };

    return(
        <div className='e-page-container'>
            <div className='btn-block-a'>
                <button onClick={handleAdd}>Add</button>
                <button onClick={handleSaveClick}>Save</button>
                <button onClick={handleUpdate}>Update</button>
            </div>
            <p style={{color:"red"}}>*請注意姓名不能重複，欄位也請不要空白</p>
            <div className='tab-block-a'>
                <table className='employee-table'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>DateOfBirth</th>
                            <th>Salary</th>
                            <th>Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {newList.map((item, index) => {
                            return(
                                <tr key={index}>
                                    <td className='border-cell'>
                                        <input
                                            type="text"
                                            value={item.name}
                                            onChange={(e) => updateItem(item.id, 'name', e.target.value, setNewList)}
                                        />
                                    </td>
                                    <td className='border-cell'>
                                        {item.dateOfBirth}
                                        <button className='calendar-btn' onClick={() => handleCalendarBtnClick(item.id, 'IsCalendarClick', true, setNewList)}><CalendarSVGIcon /></button>
                                        {item.IsCalendarClick && (
                                            // 保證index較小的calendar不會被覆蓋
                                            <div className='calendar-c-date' style={{zIndex:99999-index}}>
                                                <button className='calendar-close-btn' onClick={() => updateItem(item.id, 'IsCalendarClick', false, setNewList)}>x</button>
                                                <Calendar onChange={(date) => handleCalendarChange(item.id, 'dateOfBirth', date, setNewList)} />
                                            </div>
                                        )}
                                    </td>
                                    <td className='border-cell'>
                                        <div className="salary-r-container">
                                            <div className='salary-w'>{item.salary}</div>
                                            <input type="range" className='salary-range' min="0" max="100" value={item.salary} onChange={(e) => updateItem(item.id, 'salary', e.target.value, setNewList)} step="1" />
                                        </div>
                                    </td>
                                    <td className='border-cell'>
                                        <input
                                            type="text"
                                            value={item.address}
                                            onChange={(e) => updateItem(item.id, 'address', e.target.value, setNewList)}
                                        />
                                    </td>
                                    <td className='border-n-cell'>
                                        <button className='remove-add-i-btn' onClick={() => removeItem(item.id, newList, setNewList)}>x</button>
                                    </td>
                                </tr>
                            );
                        })}
                        {curList.map((item, index) => {
                            return(
                                <tr key={index}>
                                    <td className='border-cell'>{item.name}</td>
                                    <td className='border-cell'>{item.dateOfBirth} <CalendarSVGIcon /></td>
                                    <td className='border-cell'>
                                        <div className="salary-r-container">
                                            <div className='salary-w'>{item.salary}</div>
                                            <input type="range" className='salary-range' min="0" max="100" value={item.salary} readOnly step="1" />
                                        </div>
                                    </td>
                                    <td className='border-cell'>{item.address}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmployeePage;
