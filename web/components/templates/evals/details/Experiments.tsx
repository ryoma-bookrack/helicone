import { formatStandardDateTime } from "@/lib/i18n/format";
import { useTranslation } from "react-i18next";
import { Col, Row } from "@/components/layout/common";
import Link from "next/link";
import { useEvaluatorDetails } from "./hooks";
import { Evaluator } from "./types";

export const ExperimentsForEvaluator = ({
  evaluator,
}: {
  evaluator: Evaluator;
}) => {
  const { t } = useTranslation("evals");
  const { t: tCommon } = useTranslation("common");

  const { experiments } = useEvaluatorDetails(evaluator, () => {});

  return (
    <>
      {experiments.data?.data?.data && (
        <Col className="space-y-2">
          <h3 className="text-lg font-medium">{t("ui.experiments")}</h3>
          <span>{t("ui.thisEvaluatorHasBeenUsedInTheFollowingEx")}</span>
          <Col className="space-y-2">
            {experiments.data?.data?.data?.map((experiment) => (
              <div key={experiment.experiment_id}>
                <Link
                  href={`/experiments/${experiment.experiment_id}`}
                  className="hover:underline"
                >
                  <Row className="w-full justify-between">
                    <span>{experiment.experiment_name}</span>
                    <span>
                      {formatStandardDateTime(
                        experiment.experiment_created_at,
                      )}
                    </span>
                  </Row>
                </Link>
              </div>
            ))}
          </Col>
        </Col>
      )}
    </>
  );
};
