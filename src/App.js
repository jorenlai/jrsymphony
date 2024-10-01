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
`

const JRInput=({value,onChange})=>{
	return <Input value={value}
		onChange={(e)=>{
			onChange(e.target.value)
		}}
	/>
}


function App() {
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
		info:{
			data:'Init value'
			,name:'Value from useState'
			,phoneNumber:'00000000'
			,Xaddress:{
				city:{
					zh:'台南'
				}
			}
			,dist:"楠梓useState"
		}
		// ,data:[{a:1}]
	})



	// po('AAAAAAA',typeof [1,2,3])
	return (
		<StyledApp >
			<button
				onClick={()=>{
					ref1.current.reset()
				}}
			>
				Reset
			</button>
			<button
				onClick={()=>{
					ref1.current.post()
				}}
			>
			Submit
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
			
			<JRFields
				ref={ref1}
				cols={1}
				labelProps={{
					horizontal:true
					,layout:'h'
					,colon:': '
				}}
				initValue={{
					// info:{
						'1':2
						,'2':2
						,'3':{
							'3_1':31
						}
					// }
				}}

				columns={[
					{label:'Name',name:'name',type:JRInput,required:true//,max:3
						,validate({value,...props}){
							po('validate',props)
							if(value!=='aaa'){
								return 'Must be aaa'
							}
						}

					}
					,{label:'Address',name:'address',xrequired:true
						,columns:[
							{label:'Dist',name:'dist',type:JRInput,required:true}
							,{label:'Load',name:'road',type:JRInput,required:true}
							,{label:'City',name:'city',xrequired:true
								,columns:[
									{label:'中',name:'zh',type:JRInput,required:true}
									,{label:'Eng',name:'en',type:JRInput,required:false}
								]
							}
						]
					}
					,{label:'Age',name:'age',type:InputNumber,max:300

						,validate({value,...props}){
							po('validate',props)
							if(value<0){
								return 'Must > 0'
							}
						}
					}
					,{label:'Gender',name:'gender',type:JRInput,required:true}
				]}

				get={{
					autoRun:true
					,url:'api/JRFields.json'
				}}
				post={{
					url:'post'

				}}
				// name={'info'}
				validateValue={validateValue}
				setValidateValue={setValidateValue}
				xvalue={value}
				xonChange={(value)=>{
					// po('setValue',value)
					setValue(value)
				}}
			/> 
			{/* <JRSubmit
				get={{
					url:'api/JRSubmit'
					,autoRun:true
				}}
			/> */}
			<hr/>
			{/* {JSON.stringify(value)} */}
			<Input onChange={(e)=>{
				po('e',e.target?.value ?? e)
			}}/>
		</StyledApp>
	);
}

export default App;
