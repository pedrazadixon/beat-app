import SearchAllResults from "../components/SearchAllResults";
import SearchTabs from "../components/SearchTabs";

import PageLayout from "../layouts/PageLayout";
import PageHeader from "../layouts/PageHeader";
import PageContent from "../layouts/PageContent";

export default function SearchAllPage() {
  return (
    <PageLayout>
      <PageHeader>
        <SearchTabs />
      </PageHeader>
      <PageContent>
        <SearchAllResults />
      </PageContent>
    </PageLayout>
  );
}
