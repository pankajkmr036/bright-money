// app/hooks/useDashboard.ts
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { fetchDashboardData } from '@/store/dashboard/dashboardSlice';

export const useDashboard = () => {
  const dispatch = useAppDispatch();
  const { data, isLoading, error, lastUpdated } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    if (!data && !isLoading) {
      dispatch(fetchDashboardData());
    }
  }, [dispatch, data, isLoading]);

  const refreshDashboard = () => {
    dispatch(fetchDashboardData());
  };

  return {
    dashboardData: data,
    isLoading,
    error,
    lastUpdated,
    refreshDashboard
  };
};