import { assign, Machine, Sender } from "xstate";


export interface HoldingMachineSchema {
  states: {
    noHolding: {},
    plannedToHold: {},
    clearedToHold: {},
    inHolding: {},
    clearedToLeave: {}
  }
}
export interface HoldingMachineContext {
  previous_holding : boolean,
  assumed :boolean
};

export type HoldingMachineEvent =
| {
    type: 'PLAN_TO_HOLD';
  }
| {
    type: 'CLEAR_TO_HOLD';
  }
| {
    type: 'CANCEL_HOLD';
  }
| {
    type: 'ENTER_HOLDING_VOLUME';
  }
| {
    type: 'LEAVE_HOLDING_VOLUME';
  }
| {
    type: 'HDG';
  }
| {
    type: 'IAP';
  }
| {
    type: 'DCT';
  }
| {
    type: 'OPEN_HOLDING';
  }
| {
    type: 'REVERT_TO_HOLD';
  };

const holdingMachine = Machine<
  HoldingMachineContext,
  HoldingMachineSchema,
  HoldingMachineEvent
>(
  {
    id: 'holding',
    initial: 'noHolding',
    context: {
      previous_holding: false,
      assumed: false
    },
    states: {
      noHolding: {
        on: {
          PLAN_TO_HOLD: { target: 'plannedToHold'},
          CLEAR_TO_HOLD: { target: 'clearedToHold'},
          REVERT_TO_HOLD: { 
            cond: 'hasHeld',
            target: 'inHolding' 
          }
        },
      },
      plannedToHold: {
        on: {
          CANCEL_HOLD: { target: 'noHolding'},
          CLEAR_TO_HOLD: { target: 'clearedToHold'}
        },
      },
      clearedToHold: {
        on: {
          CANCEL_HOLD: { target: 'noHolding'},
          ENTER_HOLDING_VOLUME: { target: 'inHolding'}
        }
      },
      inHolding: {
        on: {
          HDG: { target: 'inHolding'},
          IAP: { target: 'clearedToLeave'},
          DCT: { target: 'clearedToLeave'},
          OPEN_HOLDING: { target: 'clearedToLeave'}
        }
      },
      clearedToLeave: {
        on: {
          CANCEL_HOLD: { target: 'noHolding'},
          LEAVE_HOLDING_VOLUME: { target: 'noHolding'}
        }
      }
    },
  },
  {
    guards: {
      hasHeld: (ctx) => ctx.previous_holding
    },
    actions: {

    },
  },
);

export default holdingMachine;
