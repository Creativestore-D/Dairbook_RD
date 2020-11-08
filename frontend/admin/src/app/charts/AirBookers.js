import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js";
import { useSelector } from "react-redux";
import { metronic } from "../../_metronic";

export default function AirBookersChart({data}) {
  const canvasRef = useRef();
  const { brandColor, dangerColor, successColor, primaryColor } = useSelector(
    state => ({
      brandColor: metronic.builder.selectors.getConfig(
        state,
        "colors.state.brand"
      ),
      dangerColor: metronic.builder.selectors.getConfig(
        state,
        "colors.state.danger"
      ),
      successColor: metronic.builder.selectors.getConfig(
        state,
        "colors.state.success"
      ),
      primaryColor: metronic.builder.selectors.getConfig(
        state,
        "colors.state.primary"
      )
    })
  );

  useEffect(() => {
    const config = {
      type: "doughnut",
      data: {
        labels: [
          "Free Plan",
          "Personal Plan",
          "Corporate Plan"
        ],
        datasets: [
          {
            data: data ? [data.freePlan, data.personalPlan, data.corporatePlan] : [],
            backgroundColor: [
                successColor,
                dangerColor,
                brandColor
            ]
          }
        ]
      },
      options: {
        cutoutPercentage: 75,
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: true,
            position: 'top',
            align: 'left',
            labels:{
                fontSize: 11,
            }
        },
        title: {
            display: false,
            text: 'Airbookers'
        },
        animation: {
            animateScale: true,
            animateRotate: true
        },
        tooltips: {
            enabled: true,
            intersect: false,
            mode: 'nearest',
            bodySpacing: 5,
            yPadding: 10,
            xPadding: 10,
            caretPadding: 0,
            displayColors: false,
            backgroundColor: brandColor,
            titleFontColor: '#ffffff',
            cornerRadius: 4,
            footerSpacing: 0,
            titleSpacing: 0
        }
      }
    };

    const chart = new Chart(canvasRef.current, config);

    return () => {
      chart.destroy();
    };
  }, [data, brandColor, dangerColor, successColor, primaryColor]);

  return (
    <div className="kt-chart__widget kt-chart__widget--no-padding">
      {/*<div className="kt-chart__widget_header">
        <h3 className="kt-chart__widget_title">

        </h3>
      </div>*/}
      <div className="kt-chart__widget_content">
        <div className="kt-chart__widget_chart" style={{height: "250px", width: "380px"}}>
          <div className="kt-chart__widget_stat"></div>
          <canvas ref={canvasRef} id="chart_air_bookers" />
        </div>
      </div>
        <div className="kt-chart__widget_legends">
              <div className="kt-chart__widget_legend">
                  <span className="kt-chart__widget_bullet kt-bg-success"></span>
                  <span className="kt-chart__widget_stats">{data ? data.freePlan : 0} Free Plan</span>
              </div>
              <div className="kt-chart__widget_legend">
                  <span className="kt-chart__widget_bullet kt-bg-danger"></span>
                  <span className="kt-chart__widget_stats">{data ? data.personalPlan : 0} Personal Plan</span>
              </div>
              <div className="kt-chart__widget_legend">
                  <span className="kt-chart__widget_bullet kt-bg-brand"></span>
                  <span className="kt-chart__widget_stats">{data ? data.corporatePlan : 0} Corporate Plan</span>
              </div>
          </div>
    </div>
  );
}
