import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js";
import { useSelector } from "react-redux";
import { metronic } from "../../_metronic";

export default function MyLeadsChart({data}) {
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
          "Aircrafts",
          "Engines",
          "APU",
          "Wanted",
        ],
        datasets: [
          {
            data: data ? [data.aircraftLeads, data.engineLeads, data.apuLeads, data.wantedLeads] : [],
            backgroundColor: [
                successColor,
                dangerColor,
                brandColor,
                primaryColor,
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
            text: 'Top Leads'
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
                  <span className="kt-chart__widget_stats">{data ? data.aircraftLeads : 0} Aircraft</span>
              </div>
              <div className="kt-chart__widget_legend">
                  <span className="kt-chart__widget_bullet kt-bg-danger"></span>
                  <span className="kt-chart__widget_stats">{data ? data.engineLeads : 0} Engine</span>
              </div>
              <div className="kt-chart__widget_legend">
                  <span className="kt-chart__widget_bullet kt-bg-brand"></span>
                  <span className="kt-chart__widget_stats">{data ? data.apuLeads : 0} APU</span>
              </div>
              <div className="kt-chart__widget_legend">
                  <span className="kt-chart__widget_bullet kt-bg-primary"></span>
                  <span className="kt-chart__widget_stats">{data ? data.wantedLeads : 0} Wanted</span>
              </div>
          </div>
    </div>
  );
}
