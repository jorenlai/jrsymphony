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
	const [columns,setColumns]=useState([{"name":"name","label":"useState"}])
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
					ref1.current.validateFields()
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
			{/* <JRTable
				ref={ref1}
				get={{
					url:'api/JRFields.json'
					// ,autoRun:true
					,response(res){
						// setColumns([{"name":"age","label":"setColumns"}])
						res.data={
							columns:[{aaa:111}]
							,...res.data
						}
						return res
					}
				}}
				columns={columns}
				setColumns={setColumns}
				xinitColumns={[{"name":"age","label":"initColumns"}]}
				initValue={{
					list:[
						{data:1},{data:2}
					]
					,info:{
						name:'Data'
					}
				}}
				dataSourceName={'list'}
			/> */}
			<JRFields

				ref={ref1}
				gap={'1px'}
				cols={1}
				labelProps={{
					horizontal:true
					,layout:'v'
					,colon:': '
				}}
				xinitValue={{
					name:'Init name'
					,address:{

					}
				}}

				columns={[
					{label:'Name'
						,required:true
						,max:2
						,type:InputNumber
						,name:'name'
					}
					,{label:'Age',name:'age',type:InputNumber,typeStyle:{width:'150px'}},
					,{label:'Address'
						,name:'address'
						,required:true
						,type:JRFields
						,columns:[
							// {label:'City',name:'city',xrequired:true
							// 	,columns:[
							// 		{label:'中',name:'zh',type:JRInput,required:true}
							// 		// ,{label:'Eng',name:'en',type:JRInput,required:false}
							// 	]
							// }
							// ,
							{label:'Dist',name:'dist',type:JRInput,required:true}
							,{label:'Load',name:'road',type:JRInput,required:true}
						]
					}
					,{
						label:'Render'
						,render({record,props}){
							po('props',props)
							return `${record?.name*5}`
						}
						,required:true
					}

				]}

				get={{
					autoRun:false
					,url:'api/JRFieldsx.json'
					,mask:'Loading'
					,successMessage:'Success'
					,failedMessage:'Failed'
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
			/> 
		</StyledApp>
	);
}

export default App;
