import logo from './logo.svg';
import './App.css';
import Test from './test';
import Test1 from './jrs/test1';
import JRSubmit from './jrs/JRSubmit';
import JRSelect from './jrs/JRSelect';
// import JRTable from './jrs/JRTableOld';
import { useRef, useState } from 'react';
import { genData, po } from './jrs/JRUtils';
import styled from 'styled-components';
import { Input, InputNumber, Select } from 'antd';
import JRCrud from './jrs/JRCrud';
import JRTable2 from './jrs/JRTable2';
import JRTable from './jrs/JRTable/JRTable';
import JValue from './jrs/JValue';
import { Table } from './jru/Table';
import JRFields from './jrs/JRFields/JRFields';

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

let count=0
function AppTable() {

// genData()
	const ref1=useRef()
	return <div 
		style={{
			flex:1
			,display:'flex'
			,flexDirection:'column'
			,overflow:'hidden'
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
		<Table
			me={'Table'}
			// style={{
			// 	width:'800px',height:'500px',flex:1
			// }}
			ref={ref1}
			
			get={{
				// url:'api/list.json'
				url:'api/groupList.json'
				,autoRun:true
			}}
			xinitValue={{
				data:[
					{name:'Joren'}
				]
			}}
			// dataSourceName={'dataList'}
			XXonClick={function(props){
				alert(JSON.stringify(props))
			}}
			groupHeader={[
				{
					label:'Group Header',colSpan:7
					,render({groupData,groupIndex}){
						const totalAge=groupData?.reduce((acc,record)=>{
							return acc+=record.age ?? 0
						},0)
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
					{label:'Group Footer 3',colSpan:7
						,render({groupData}){
							return ` All ${groupData.length} record`
						}
					}
				]
			]}
			columns={[
				
				{name:'name',label:'Name',type:JRInput}
				,{name:'fullName',label:'Full Name'
					,columns:[
						{name:'firstName',label:'First Name',Xtype:Input}
						,{name:'lastName',label:'Last Name',Xtype:JRInput}
					]	
				}
				,{name:'age',label:'Age',Xtype:InputNumber,width:'80px'}
				// ,{name:'address',label:'Address'}
				
				

			]}
			footer={function({style}){
				style.padding='12px'
				const type=()=>{

				}

				const type2=<JRFields/>

				const type3={
					type:JRFields
				}
				po('type',type)
				po('type2',type2)
				po('type3',type3)
				return <div style={{color:'white'}}>
					{typeof type}<br/>
					{typeof type2} - {type2.type}<br/>
					{typeof type3} - {type3.type}<br/>
				</div>
				// style.border='10px solid red'
				// style.overflow='hidden'
				// po('this footer',this)
				// const me=this
				// return <JRFields
				// 	onChange={me.setValue}
				// 	value={this.getValue()}
				// 	columns={[
				// 		{name:'id',label:'ID',type:Input}
				// 	]}
				// />
				//<pre>{JSON.stringify(this.getValue(),4,4)}</pre>
			}}
			cccfooter={{
				type:JRFields
				,me:'Form'
				,columns:[
					{name:'id',label:'ID',type:Input}
				]
				,style:{
					border:'10px solid red'
				}
			}}
			fyyter={<JRFields/>}
		/>
	</div>
}
export default AppTable













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