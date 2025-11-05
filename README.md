## Expenses Overview Sidebar

To use the `ExpensesSidebar` component, import it and include it in your page. It will automatically fetch and display the expenses overview data, including key performance indicators (KPIs) like total expenses, top category, average daily spend, largest expense, and a 7-day trend.

The component supports different time periods (Today, This Week, This Month, Custom Range) which can be selected via a dropdown. When 'Custom Range' is selected, you can specify a start and end date to view expenses for a specific period.

**API Endpoint:**

The `ExpensesSidebar` component fetches its data from the `/api/expenses/overview` endpoint. This endpoint accepts the following query parameters:
- `period`: (Optional) `today`, `thisWeek`, `thisMonth`, `custom`. Defaults to `thisMonth`.
- `startDate`: (Required if `period` is `custom`) The start date for the custom period in `YYYY-MM-DD` format.
- `endDate`: (Required if `period` is `custom`) The end date for the custom period in `YYYY-MM-DD` format.

**Usage Example:**

```jsx
import ExpensesSidebar from './src/components/bodyComponents/expenses/ExpensesSidebar';

const MyPage = () => {
  return (
    <div>
      {/* Other content */}
      <ExpensesSidebar />
    </div>
  );
};
```