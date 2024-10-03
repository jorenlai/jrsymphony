import logo from './logo.svg';
import './App.css';
import Test from './test';
import Test1 from './jrs/test1';
import JRSubmit from './jrs/JRSubmit';
import JRFields from './jrs/JRFields';
import JRSelect from './jrs/JRSelect';
import JRTable from './jrs/JRTable';
import { useRef, useState } from 'react';
import { po } from './jrs/JRUtils';
import styled from 'styled-components';
import { Input, InputNumber, Select } from 'antd';

const StyledApp = styled.div`
    html,*,*:before,*:after {
        box-sizing: border-box;
    }
	padding:22px;
`

export const JRInput=({value,onChange,name})=>{
	return <Input value={value}
		onChange={(e)=>{
			onChange(e.target.value)
		}}
	/>
}


function App() {
	const [columns,setColumns]=useState([{"name":"name","label":"Name"}])
	const mapp=Object.assign({a:1},{b:2})
	const ref1=useRef()
	const [validateValue,setValidateValue]=useState(
		{
			"gender": {
				"$message": "This field is required"
			}
			// ,address:{
			// 	dist: {
			// 		"$message": "This field is required"
			// 	}
			// }
					
		}
	)
	const [value,setValue]=useState({
		// info:{
			data:'useState value'
			,name:'Value from useState'
			,phoneNumber:'00000000'
			,Xaddress:{
				city:{
					zh:'台南'
				}
			}
			// ,dist:"楠梓useState"
		// }
		// ,data:[{a:1}]
	})



	// po('AAAAAAA',typeof [1,2,3])
	return (
		<StyledApp >
			<button
				onClick={()=>{
					ref1.current.validate()
				}}
			>
				Validate
			</button>

			<button
				onClick={()=>{
					ref1.current.reset()
				}}
			>
				Reset
			</button>
			<button
				onClick={()=>{
					ref1.current.get()
				}}
			>
			get
			</button>
			<button
				onClick={()=>{
					ref1.current.get({
						url:'api/JRFields.json'
						,value(value){
							return {
								valueFromOnClickGetFunction:'22222222222222'
							}
						}
						,formatValue(value){
							return {
								...value
								,valueFromOnClickFormatedValue:'567456534'
							}
						}
					})
				}}
			>
			JRFields
			</button>
			<button
				onClick={()=>{
					ref1.current.get({
						url:'api/XXXX'
						,updateValue:true
						,value(value){
							return {
								bbbbbbbbbbb:'22222222222222'
							}
						}

					})
				}}
			>
			XXX
			</button>
			<JRTable
				ref={ref1}
				get={{
					url:'api/JRFields.json'
					// ,autoRun:true
					,response(res){
						setColumns([{"name":"age","label":"Age"}])
						return res
					}
				}}
				columns={columns}
				initValue={{
					list:[
						{data:1},{data:2}
					]
					,info:{
						name:'Data'
					}
				}}
				dataSourceName={'list'}
			/>
			{/* <JRFields

				ref={ref1}
				gap={'1px'}
				cols={1}
				labelProps={{
					horizontal:true
					,layout:'h'
					,colon:': '
				}}
				xinitValue={{
					name:'Init name'
					,address:{

					}
				}}

				columns={[
					{label:'Name',render({value}){
						po('vvvvvvv',value)
						return 'AAAAAA'
					}}
					,{label:'Age',name:'age',type:JRInput},
					 ,
					{label:'Address'
						,name:'address'
						,required:true
						,type:JRFields
						,columns:[
							{label:'City',name:'city',xrequired:true
								,columns:[
									{label:'中',name:'zh',type:JRInput,required:true}
									// ,{label:'Eng',name:'en',type:JRInput,required:false}
								]
							}
							,{label:'Dist',name:'dist',type:JRInput,required:true}
							,{label:'Load',name:'road',type:JRInput,required:true}
						]
					}

				]}

				get={{
					autoRun:false
					,url:'api/JRFields.json'
				}}
				post={{
					url:'post'

				}}
				// name={'info'}
				// validateValue={validateValue}
				// setValidateValue={setValidateValue}
				// value={value}
				// onChange={(value)=>{
				// 	// po('setValue',value)
				// 	setValue(value)
				// }}
			/>  */}
		</StyledApp>
	);
}

export default App;
