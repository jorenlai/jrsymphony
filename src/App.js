import logo from './logo.svg';
import './App.css';
import Test from './test';
import Test1 from './jrs/test1';
import JRSubmit from './jrs/JRSubmit';
import JRFields from './jrs/JRFields';
import JRSelect from './jrs/JRSelect';
// import JRTable from './jrs/JRTableOld';
import { useRef, useState } from 'react';
import { po } from './jrs/JRUtils';
import styled from 'styled-components';
import { Input, InputNumber, Select } from 'antd';
import JRCrud from './jrs/JRCrud';
import JRTable2 from './jrs/JRTable2';
import JRTable from './jrs/JRTable';
import JValue from './jrs/JValue';

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


const StyledJRCrud=styled(JRCrud)`
	background: blue;
`
function AppCrud(){
	return <StyledJRCrud>

	</StyledJRCrud>
}

function AppForm() {
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
					ref1.current.get({
						sendValue:false
					})
				}}
			>
			get
			</button>
			<button
				onClick={()=>{
					ref1.current.post({
						sendValue:true
						,formatValue(data){
							po('data',data)
							return {
								name:'formatValue'
							}
						}
						,callback(a,b,c,d){
							po('aaaaaa,b,c,d',a,b,c,d)
						}
					})
				}}
			>
			post
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
				debugMode={true}
				style={{
					padding:'22px'
					,border:'1px solid gray'
				}}
				ref={ref1}
				gap={'22px'}
				cols={1}
				labelProps={{
					horizontal:true
					,layout:'h'
					,colon:': '
				}}
				XXXinitValue={{
					
						name:'Init name'
						,address:{
							
						}
						,dist:'aa'

						,data:{
							dist:'bb'
						}
				}}
				// dataSourceName={'data'}
				// value={value}
				// onChange={setValue}
				columns={[
					{label:'Dist',name:'dist',type:JRInput,required:true},
					{
						label:'Name A'
						,required:{
							value:true
							,msg:'我是A{age}'
						}
						,max:2
						,type:Input
						,name:'name'
					}
					,{label:'Age',name:'age',type:InputNumber,typeStyle:{width:'150px'}}
					,{
						label:'Address'
						,name:'address'
						// ,type:JRFields
						,columns:[
							{label:'Dist',name:'dist',type:JRInput
								,required:{
									value:true
									,msg:'當Name為{name},這需為3.'
								}
							}
							,{label:'Load',name:'road',type:JRInput,xrequired:true}
							// ,{label:'City',name:'city'
							// 	,columns:[
							// 		{label:'中',name:'ch'}
							// 		,{label:'Englist',name:'en'}
							// 	]
							// }
						]
					}
					// ,{
					// 	label:'Address 1'
					// 	,name:'address'
					// 	,required:true
					// 	,type:JRFields
					// 	,columns:[
					// 		{label:'Dist',name:'dist',type:JRInput
					// 			,required:{
					// 				value:true
					// 				,msg:'當Name為{name},這需為3.'
					// 			}
					// 		}
					// 		,{label:'Load',name:'road',type:JRInput,required:true}
					// 		,{label:'City',name:'city'}
					// 	]
					// }
					,{
						label:'Address 2'
						,columns:[
							{label:'Dist',name:'dist',type:JRInput,xrequired:true}
							,{label:'Load',name:'road',type:JRInput,required:true}
						]
					}
					// ,{
					// 	label:'Render'
					// 	,render({record,props}){
					// 		return `${record?.name*5}`
					// 	}
					// 	,required:true
					// }

				]}
				footer={({value})=>{
					return <pre>{JSON.stringify(value,null,4)}</pre>
				}}

				get={{
					autoRun:0
					,url:'api/:data JRFields.json'
					,mask:'Loading'
					,successMessage:'Success'
					,failedMessage:'Failed'
					,xvalue(){
						return {
						data:'function-value'
					}}
				}}
				post={{
					url:'api/JRFields.json'
					,updateValue:true
					,method:'get'

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

let count=0
function AppTable() {
	const ref1=useRef()
	return <div 
		style={{
			flex:1
			,border:'10px solid blue'
			,display:'flex'
			,flexDirection:'column'
		}}
	>
		<div>
			<button
				onClick={()=>{
					ref1.current.reset()
				}}
			>Reset</button>
			<button
				onClick={()=>{
					++count
					ref1.current.add({
						name:`Add ${count}`
					},null,1)
				}}
			>Add</button>
		</div>
		<JRTable
			style={{
				width:'800px',height:'500px',flex:1
			}}
			ref={ref1}
			
			get={{
				url:'api/mapGroupList.json'
				// url:'api/list.json'
				,autoRun:true
			}}
			xinitValue={{
				data:[
					{name:'Joren'}
				]
			}}
			dataSourceName={'dataList'}
			// dataGroupName={'dataGroup'}
			XXXonClick={function(props){
				po('this',this)
				po('value',this.getValue())
				po('dataSource',this.getDataSource())
				alert(JSON.stringify(props))
			}}
			groupHeader={[
				{
					label:'Group Header',colSpan:7
					,render({groupData,groupIndex}){
						const totalAge=groupData?.reduce((acc,record)=>{
							return acc+=record.age ?? 0
						},0)
						po('thisooooo',this,groupData)
						po('groupData',groupData)
						return `Total age: ${totalAge}`
					}
				}
			]}
			groupFooter={[
				[
					{label:'Name',colSpan:2
						,render({groupData}){
							return `My name is ${groupData?.[0]?.fullName?.firstName} ${groupData?.[0]?.fullName?.lastName}  `
						}
					}
					,{}
					,{label:'Address',colSpan:4}
				]
				,[
					{label:'Group Footer 3',colSpan:7}
				]
			]}
			columns={[
				{name:'fullName',label:'Name'//,type:JValue
					// ,render({index,groupIndex},b,c){
					// 	return `'Render' ${groupIndex} ${index}`
					// }
					// ,width:'100px'
					,columns:[
						{name:'firstName',label:'First Name',type:JRInput}
						,{name:'lastName',label:'Last Name',type:JRInput}
					]	
				}
				// ,{name:'gender',label:'Gender'}
				// ,{name:'age',label:'Age'}
				// ,
				,{name:'age',label:'Age',type:InputNumber
					,onClick(e){
						// alert('ccc')
						e.preventDefault()
						e.stopPropagation()
					}
				}
				,{
					name:'address',label:'Address'
					,columns:[
						{name:'addresses'//,label:'Address'
							,columns:[
								{name:'no',label:'No'
									,width:'120px'
									,Xtype:JRInput
								}
								,{name:'street',label:'Street'
									,width:'180px'
									,Xtype:JRInput
								}
							]
						}
						,{name:'city',label:'City'
							,width:'180px'
							,Xtype:JRInput
						}
						,{name:'country',label:'Country'
							,width:'140px'
							,Xtype:JRInput
							
						}
					]
				}
				// ,{
				// 		// width:'100%'
				// }
				// ,{name:'1',label:'1'
				// 	,columns:[
				// 		{name:'11',label:'1 1'}
				// 		,{name:'12',label:'1 2'}
				// 	]
				// }
				// ,{name:'2',label:'2'
				// 	,columns:[
				// 		{name:'21',label:'2 1'}
				// 		,{name:'22',label:'2 2'}
				// 	]
				// }
				// ,{name:'3',label:'3'
				// 	,columns:[
				// 		{name:'31',label:'3 1'}
				// 		,{name:'32',label:'3 2'
				// 			,columns:[
				// 				{name:'321',label:'3 2 1'}
				// 				,{name:'322',label:'3 2 2'
				// 					,columns:[
				// 						{name:'3221',label:'3 2 2 1'}
				// 						,{name:'3222',label:'3 2 2 2'
				// 							,columns:[
				// 								{name:'32221',label:'3 2 2 2 1'}
				// 								,{name:'32222',label:'3 2 2 2 2'}
				// 							]
				// 						}
				// 					]
				// 				}
				// 			]
				// 		}
				// 		,{name:'33',label:'3 3'
				// 			,columns:[
				// 				{name:'331',label:'3 3 1'}
				// 				,{name:'332',label:'3 3 2'
				// 					// ,columns:[
				// 					// 	{name:'3221',label:'3 2 2 1'}
				// 					// 	,{name:'3222',label:'3 2 2 2'}
				// 					// 	// ,{name:'3223',label:'3 2 2 3'}
				// 					// ]
				// 				}
				// 			]
				// 		}
				// 		,{name:'34',label:'3 4'}
				// 	]
				// }

				// ,{name:'label',label:'Label'}
				// ,{name:'name',label:'Name'
				// 	,columns:[
				// 		{name:'firstName',label:'First Name'}
				// 		,{name:'lastName',label:'Last Name'}
				// 	]
				// }

			]}
		/>
	</div>
}
export default AppTable
