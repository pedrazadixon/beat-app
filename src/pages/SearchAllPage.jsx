import SearchAllResults from "../components/SearchAllResults";
import SearchTabs from "../components/SearchTabs";

import PageLayout from "../layouts/PageLayout";
import PageHeader from "../layouts/PageHeader";
import PageContent from "../layouts/PageContent";
import SearchInput from "../components/SearchInput";

export default function SearchAllPage() {
  return (
    <PageLayout>
      <PageHeader>
        <SearchInput />
        <SearchTabs />
      </PageHeader>
      <PageContent>
        <SearchAllResults />
      </PageContent>
    </PageLayout>
  );
}
