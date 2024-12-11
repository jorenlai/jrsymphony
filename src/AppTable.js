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
					},null)
				}}
			>Add </button>
			<button
				onClick={()=>{
					++count
					ref1.current.add({
						name:`Add ${count}`
					},0,0)
				}}
			>Add to group</button>
		</div>
		<Table
			onRowClick={({record})=>{
				alert(JSON.stringify(record))
			}}
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
			initValue={[
					{name:'Joren'}
				]
			}
			xdataSourceName={'dataList'}
			XXonClick={function(props){
				alert(JSON.stringify(props))
			}}
			XgroupHeader={[
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

			footColumns={[
				[
					{label:'Name',xcolSpan:2
						,render({groupData}){
							return `My name is ${groupData?.[0]?.fullName?.firstName} ${groupData?.[0]?.fullName?.lastName}  `
						}
					}
					,{label:'Address',xcolSpan:4}
					,{label:'Address',xcolSpan:4}
					,{label:'Address',rowSpan:4}
					,{label:'Address',rowSpan:4}
				]
				,[
					{label:'Name',xcolSpan:2
						,render({groupData}){
							return `My name is ${groupData?.[0]?.fullName?.firstName} ${groupData?.[0]?.fullName?.lastName}  `
						}
					}
					,{label:'2',colSpan:2}
				]
				
			]}


			columns={[
				
				{name:'name',label:'Name',type:JRInput}
				,{name:'fullName',label:'Full Name'
					// ,type:JRFields
					,columns:[
						{name:'firstName',label:'First Name',Xtype:Input}
						,{name:'lastName',label:'Last Name',XgroupFootertype:JRInput}
					]	
				}
				,{name:'age',label:'Age',Xtype:InputNumber,width:'80px'}
				,{name:'address',label:'Address'}
				
				

			]}
			
			// start={function({setStyle}){
			// 	setStyle({
			// 		border:'1px solid red'
			// 	})
			// 	return <div>start</div>
			// }}
			right={function({setStyle}){
				po('left this ',this)
				setStyle({
					flexBasis:'300px'
					,border:'1px solid gray'
					,overflow: 'overlay'
				})
				return <pre>{JSON.stringify(this.getValue(),null,2)}</pre>
			}}
			Xheader={function({setStyle}){
				setStyle({
					border:'1px solid blue'
					,flexBasis:'200px'
					,overflow: 'overlay'
				})
				const me=this
				return <div>
					<button
						onClick={()=>{
							me.add({name:'Added name'},1,0)
						}}
					>Button</button>
					<pre>{JSON.stringify(this.getValue(),null,4)}</pre>
				</div>
			}}
			Xfooter={function({setStyle}){
				setStyle({
					border:'1px solid yellow'
				})
				return <div>AVC</div>
			}}
			// right={function({setStyle}){
			// 	setStyle({
			// 		flexBasis:'200px'
			// 		,border:'1px solid pink'
			// 	})
			// 	return <div>I am Right</div>
			// }}
			// end={function({setStyle}){
			// 	setStyle({
			// 		border:'1px solid purple'
			// 	})
			// 	return <div>End</div>
			// }}
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