import React, { useEffect, useMemo, useRef } from "react";
import { Chart } from "chart.js";
import { useSelector } from "react-redux";
import { metronic } from "../../_metronic";
import moment from "moment";

export default function NewUsersChart({charData}) {
  const ref = useRef();
  const { brandColor, shape2Color, shape3Color } = useSelector(state => ({
    brandColor: metronic.builder.selectors.getConfig(
      state,
      "colors.state.brand"
    ),
    shape2Color: metronic.builder.selectors.getConfig(
      state,
      "colors.base.shape.2"
    ),
    shape3Color: metronic.builder.selectors.getConfig(
      state,
      "colors.base.shape.3"
    )
  }));
  let months = [];
  let newUsers = [];
  if(charData){
    charData.sort(function(a, b){return a.month - b.month});
    charData.forEach(function (obj, index) {
      months.push(""+moment(obj.month, 'M').format('MMMM')+"");
      newUsers.push(""+obj.users+"");
    });
  }

  let data = useMemo(
    () => ({
      labels: months,
      datasets: [
        {
          label: "Users",
          fill:false,
          borderColor: "#8e5ea2",
          data: newUsers,
        }
      ]
    }),
    [brandColor, months]
  );

  useEffect(() => {
    // For more information about the chartjs, visit this link
    // https://www.chartjs.org/docs/latest/getting-started/usage.html
    const chart = new Chart(ref.current, {
            data: data,

      type: "line",
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: true,
            position: 'top',
        },
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: false,
                labelString: "Month"
              },
            }
          ],
          yAxes: [
            {
              scaleLabel: {
                display: false,
                labelString: "Value"
              },
            }
          ]
        },
        title: {
          display: false
        },
        tooltips: {
          enabled: true,
          intersect: false,
          mode: "nearest",
          bodySpacing: 5,
          yPadding: 10,
          xPadding: 10,
          caretPadding: 0,
          displayColors: false,
          backgroundColor: Chart.helpers.color('#000000').alpha(0.6).rgbString(),
          titleFontColor: "#ffffff",
          cornerRadius: 4,
          footerSpacing: 0,
          titleSpacing: 0
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 5,
            bottom: 5
          }
        }
      }
    });

    return () => {
      chart.destroy();
    };
  }, [data, brandColor, shape2Color, shape3Color]);

  return (
    <div className="kt-chart__widget kt-chart__widget--no-padding">
      <div className="kt-chart__widget_content">
        <div className="kt-chart__widget_item">
          <div className="kt-chart__widget_info">
            <span className="kt-chart__widget_desc">New users based on monthly</span>
          </div>
        </div>
      </div>
      <div className="kt-chart__widget_chart" style={{ height: "250px" }}>
        <canvas
          ref={ref}
          width={683}
          height={312}
          id="kt_chart_order_statistics"
        />
      </div>
    </div>
  );
}
