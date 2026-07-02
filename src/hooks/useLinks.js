import { useSelector, useDispatch } from "react-redux";
import { clearLinkError, clearCurrentLink } from "../features/links/linkSlice";

const useLinks = () => {
     const dispatch = useDispatch();
     const state = useSelector((s) => s.links);

     return {
          links: state.links ?? [],
          pagination: state.pagination ?? {
               total: 0,
               page: 1,
               limit: 20,
               totalPages: 1,
          },
          currentLink: state.currentLink ?? null,
          analytics: state.analytics ?? null,
          stats: state.stats ?? null,
          topStats: state.topStats ?? null,
          loading: state.loading,
          createLoading: state.createLoading,
          analyticsLoading: state.analyticsLoading,
          statsLoading: state.statsLoading,
          error: state.error,
          clearError: () => dispatch(clearLinkError()),
          resetCurrent: () => dispatch(clearCurrentLink()),
     };
};

export default useLinks;
