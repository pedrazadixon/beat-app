import PageContent from "../layouts/PageContent";
import PageHeader from "../layouts/PageHeader";
import PageLayout from "../layouts/PageLayout";
import SearchTabs from "../components/SearchTabs";
import SearchTracksResults from "../components/SearchTracksResults";

export default function SearchTracksPage() {
  return (
    <PageLayout>
      <PageHeader>
        <SearchTabs />
      </PageHeader>
      <PageContent>
        <SearchTracksResults />
      </PageContent>
    </PageLayout>
  );
}
