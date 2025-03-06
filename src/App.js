import logo from './logo.svg';
import './App.css';
import Test from './test';
import Test1 from './jrs/test1';
import JRSubmit from './jrs/JRSubmit';
import JRSelect from './jrs/JRSelect';
// import JRTable from './jrs/JRTableOld';
import { useRef, useState } from 'react';
import { po } from './jrs/JRUtils';
import styled from 'styled-components';
import { Input, InputNumber, Select } from 'antd';
import JRCrud from './jrs/JRCrud';
import JRTable2 from './jrs/JRTable2';
import JRTable from './jrs/JRTable/JRTable';
import JValue from './jrs/JValue';
import { Table } from './jru/Table';
import JRFields from './jrs/JRFields/JRFields';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppTable from './AppTable';
import AppFrame from './AppFrame';
import AppForm from './AppForm';
import AppModal from './AppModal';


let count=0
function App() {
	return <BrowserRouter>
		<Routes>
			<Route path="/table" element={<AppTable/>}/>
			<Route path="/form" element={<AppForm/>}/>
			<Route path="/frame" element={<AppFrame/>}/>
			<Route path="/modal" element={<AppModal/>}/>
		</Routes>
	</BrowserRouter>
}
export default App
