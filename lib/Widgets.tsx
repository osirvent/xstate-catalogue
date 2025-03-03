import React, { useContext, ReactNode } from 'react'
import { MachineHelpersContext } from './MachineHelpers';
import { useService } from '@xstate/react';

const HoldingWidget = () => {  
  const context = useContext(MachineHelpersContext);  
  const [state] = useService(context.service)

	return (
		<svg 
			xmlns="http://www.w3.org/2000/svg" 
			className={`h-12 w-12 mr-20 transition-colors ease-in-out duration-1000 
				${ state.matches('inHolding')
			  ? 'text-green-600 animate-spin'
			  : 'text-gray-300'
			}`}  
			fill="none" 
			viewBox="0 0 24 24" 
			stroke="currentColor"
		>
  		<path 
				strokeLinecap="round" 
				strokeLinejoin="round" 
				strokeWidth="2" 
				d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" 
			/>
		</svg>
	)
};

const LabelWidget = () => {
	const context = useContext(MachineHelpersContext);  
  const [state] = useService(context.service)

	let isPlanned = state.matches('plannedToHold')
	let isClearedToHold = state.matches('clearedToHold')
	let isClearedToLeave = state.matches('clearedToLeave')

	let isColor = "text-gray-600"
	let isNotColor = "text-gray-300"

	return (
		<div className="flex justify-end text-5xl text-gray-600">
			<div className={isPlanned ? isColor : isNotColor}>(</div>
			{isClearedToHold ? (
				<div className = {isColor}>&rarr;</div>
					) : isClearedToLeave ? (
						<div className = {isColor}>&larr;</div>
					) : (
						<div className = {isNotColor}>&rarr;</div>
					)
			}
			<div className={isPlanned ? isColor : isNotColor}>)</div>
			<div className="ml-2"> 
				VLG5432
			</div>
		</div>
	)
}

export const Widget = () => {

	return (
		<div className="flex">
			<HoldingWidget />
			<LabelWidget />
		</div>
	)
}
