import { setTrigger, Triggers } from "@/redux/slices/triggerSlice";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store";
import { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";

// ** Return type of the custom hook defined ** \\
interface UseReduxReturnType {
  dispatch: ThunkDispatch<RootState, undefined, UnknownAction>;
  mutateTrigger: (trigger: keyof Triggers, value: boolean) => void;
  getTrigger: (trigger: keyof Triggers) => boolean;
}

// ** Custom hook to help manipulate redux better ** \\
const useRedux = (): UseReduxReturnType => {
  const dispatch = useAppDispatch();
  const mutateTrigger = (trigger: keyof Triggers, value: boolean) =>
    dispatch(setTrigger({ trigger, value }));
  const getTrigger = (trigger: keyof Triggers) => useAppSelector((state) => state.triggers[trigger]);

  return {
    dispatch,
    mutateTrigger,
    getTrigger,
  }
};

export default useRedux;