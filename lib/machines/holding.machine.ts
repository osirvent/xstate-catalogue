import { assign, createMachine, Sender } from "xstate";

export interface HoldingMachineContext {};

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

const holdingMachine = createMachine<
  HoldingMachineContext,
  HoldingMachineEvent
>(
  {
    id: 'holding',
    initial: 'noHolding',
    states: {
      noHolding: {
        on: {
          PLAN_TO_HOLD: { target: 'plannedToHold'},
          CLEAR_TO_HOLD: { target: 'clearedToHold'},
          REVERT_TO_HOLD: { target: 'inHolding'}
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
    services: {

    },
    actions: {

    },
  },
);

export default holdingMachine;
